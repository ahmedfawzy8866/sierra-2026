/**
 * Property Finder Integration Service
 * Syncs leads and listings between Sierra Blu CRM and PF Enterprise API (atlas.propertyfinder.com/v1)
 */

import { pfClient, PFListing, PFLead } from '../property-finder-client';
import { adminDb } from '../server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Unit, Lead, COLLECTIONS, UserProfile } from '../models/schema';

export interface PFLeadSyncSummary {
  created: number;
  updated: number;
  skipped: number;
}

export class PFIntegrationService {

  static async syncIncomingLeads(): Promise<PFLeadSyncSummary> {
    const summary: PFLeadSyncSummary = { created: 0, updated: 0, skipped: 0 };
    const pfLeads = await pfClient.fetchLeads({ perPage: '50' });

    for (const lead of pfLeads.data) {
      const existing = await adminDb.collection(COLLECTIONS.stakeholders)
        .where('pfLeadId', '==', lead.id)
        .get();

      const phone = lead.sender?.phone || '';
      if (!phone && existing.empty) {
        summary.skipped++;
        continue;
      }

      const payload: Partial<Lead> & Record<string, unknown> = {
        name: lead.sender?.name || 'Property Finder Lead',
        phone,
        email: lead.sender?.email || '',
        source: 'property-finder',
        stage: 'inbound',
        phase: lead.status === 'replied' ? 'consultation' : 'acquisition',
        originChannel: `Property Finder (${lead.channel})`,
        pfLeadId: lead.id,
        pfListingReferenceNumber: lead.listing?.reference || '',
        updatedAt: Timestamp.now(),
      };

      if (existing.empty) {
        await adminDb.collection(COLLECTIONS.stakeholders).add({
          ...payload,
          automation: { botInitiated: false, scoringCompleted: false, whatsappFollowupSent: false, viewingReminderSent: false },
          createdAt: Timestamp.now(),
        });
        summary.created++;
      } else {
        await existing.docs[0].ref.update(payload);
        summary.updated++;
      }
    }

    return summary;
  }

  static async syncIncomingListings() {
    let imported = 0;
    let updated = 0;

    const pfListings = await pfClient.searchListings({ perPage: '100' });

    for (const listing of pfListings.results) {
      const ref = listing.reference || String(listing.id);
      const existing = await adminDb.collection(COLLECTIONS.units)
        .where('pfReferenceNumber', '==', ref)
        .get();

      const payload: Partial<Unit> = {
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price?.value || 0,
        propertyType: listing.type as any,
        status: listing.offering === 'rent' ? 'rented' : 'available',
        category: listing.category || 'residential',
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        area: listing.area || 0,
        pfReferenceNumber: ref,
        updatedAt: Timestamp.now(),
        images: listing.media?.images?.map(i => i.original.url) || [],
      };

      if (existing.empty) {
        await adminDb.collection(COLLECTIONS.units).add({ ...payload, createdAt: Timestamp.now() });
        imported++;
      } else {
        await existing.docs[0].ref.update(payload);
        updated++;
      }
    }

    return { imported, updated };
  }

  static async publishListing(unitId: string) {
    const unitSnap = await adminDb.collection(COLLECTIONS.units).doc(unitId).get();
    if (!unitSnap.exists) throw new Error('Unit not found');

    const unit = { id: unitSnap.id, ...unitSnap.data() } as Unit;
    const locationId = await this.resolveLocationId(unit);
    const publicProfileId = await this.resolvePublicProfileId();

    const pfListing: Omit<PFListing, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      title: unit.title,
      description: unit.description || unit.title,
      price: { value: unit.price, currency: 'EGP', type: unit.status === 'rented' ? 'rent' : 'sale' },
      type: this.mapPropertyType(unit.propertyType),
      category: 'residential',
      offering: unit.status === 'rented' ? 'rent' : 'sale',
      bedrooms: unit.bedrooms || 0,
      bathrooms: unit.bathrooms || 0,
      area: Math.max(unit.area || 0, 1),
      locationId,
      publicProfileId,
      media: {
        images: (unit.images || []).map(url => ({ original: { url } })),
      },
    };

    const result = await pfClient.createListing(pfListing);

    await adminDb.collection(COLLECTIONS.units).doc(unitId).update({
      'automation.isPublishedToPF': true,
      pfReferenceNumber: result.reference || String(result.id),
      lastSyncAt: Timestamp.now(),
      syncSource: 'property-finder',
    });

    if (result.id) {
      await pfClient.publishListing(result.id);
    }

    return result;
  }

  private static async resolveLocationId(unit: Unit): Promise<number> {
    const lookup = unit.compound || unit.location || unit.city || 'New Cairo';
    try {
      const result = await pfClient.searchLocations(lookup);
      return result.data[0]?.id || 1;
    } catch {
      return 1;
    }
  }

  private static async resolvePublicProfileId(): Promise<number> {
    try {
      const users = await pfClient.getUsers({ perPage: '1' });
      return users.data[0]?.publicProfile?.id || 1;
    } catch {
      return 1;
    }
  }

  private static mapPropertyType(type: string): PFListing['type'] {
    const mapping: Record<string, PFListing['type']> = {
      apartment: 'apartment', villa: 'villa', townhouse: 'townhouse',
      penthouse: 'penthouse', duplex: 'duplex', chalet: 'chalet',
      'twin-house': 'twin-house', palace: 'palace', land: 'land',
    };
    return mapping[type?.toLowerCase()] || 'apartment';
  }
}
