"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import type { PFListing } from "@/lib/property-finder-client";
import { PFIntegrationService } from "@/lib/services/PFIntegrationService";

export type SBRListing = PFListing;
export type PFSyncResult = { success: boolean; id?: string; error?: string };

export interface ListingWithAnalytics extends SBRListing {
  pfViews?: number;
  pfLeads?: number;
  pfPhoneReveals?: number;
  pfImpressions?: number;
  pfCTR?: number;
  syncedToPF?: boolean;
  dealStatus?: string;
}

export function usePFListings(options: {
  syncedOnly?: boolean;
  compound?: string;
  maxLimit?: number;
} = {}) {
  const { syncedOnly = false, compound, maxLimit = 50 } = options;

  const [listings, setListings] = useState<ListingWithAnalytics[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    const db = getFirestore();
    const constraints: Parameters<typeof where>[] = [];

    if (syncedOnly) constraints.push(where("syncedToPF", "==", true) as unknown as Parameters<typeof where>);
    if (compound)   constraints.push(where("compound", "==", compound) as unknown as Parameters<typeof where>);

    const q = query(
      collection(db, "listings"),
      ...(constraints as unknown as Parameters<typeof query>[1][]),
      where("status", "==", "active"),
      orderBy("aiScore", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .slice(0, maxLimit)
          .map(d => ({ id: d.id, ...d.data() } as ListingWithAnalytics));
        setListings(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [syncedOnly, compound, maxLimit]);

  const syncListing = useCallback(
    async (listing: SBRListing): Promise<PFSyncResult> => {
      try {
        const result = await PFIntegrationService.publishListing(listing.id || '');
        return { success: true, id: result.id };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    },
    []
  );

  const syncedCount   = listings.filter(l => l.syncedToPF).length;
  const unsyncedCount = listings.filter(l => !l.syncedToPF).length;
  const hiddenGems    = listings.filter(l => l.dealStatus === "Hidden Gem");

  return {
    listings,
    loading,
    error,
    syncListing,
    syncedCount,
    unsyncedCount,
    hiddenGems,
    totalActive: listings.length,
  };
}
