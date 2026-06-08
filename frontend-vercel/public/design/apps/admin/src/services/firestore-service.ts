/**
 * SIERRA ESTATES — ADMIN PORTAL FIRESTORE INTEGRATION
 * Shared service to connect admin portal to the main Firestore database
 * and sync real-time data from the main app.
 */

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export type FirestoreDoc = Record<string, unknown> & { id: string };

export interface FirestoreService {
  fetchCollection: (collectionName: string, constraints?: QueryConstraint[]) => Promise<FirestoreDoc[]>;
  subscribeToCollection: (
    collectionName: string,
    callback: (data: FirestoreDoc[]) => void,
    constraints?: QueryConstraint[]
  ) => Unsubscribe;
  subscribeToDocument: (
    collectionName: string,
    documentId: string,
    callback: (data: FirestoreDoc) => void
  ) => Unsubscribe;
}

/**
 * Initialize Firestore service for admin portal
 */
export const firestoreService: FirestoreService = {
  /**
   * Fetch a collection with optional query constraints
   */
  async fetchCollection(collectionName: string, constraints: QueryConstraint[] = []) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(`Error fetching collection ${collectionName}:`, error);
      return [];
    }
  },

  /**
   * Subscribe to real-time updates from a collection
   */
  subscribeToCollection(collectionName: string, callback: (data: FirestoreDoc[]) => void, constraints: QueryConstraint[] = []) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      });
    } catch (error) {
      console.error(`Error subscribing to collection ${collectionName}:`, error);
      return () => {};
    }
  },

  /**
   * Subscribe to real-time updates from a specific document
   */
  subscribeToDocument(collectionName: string, documentId: string, callback: (data: FirestoreDoc) => void) {
    try {
      const docRef = collection(db, collectionName);
      // Query for the specific document
      const q = query(docRef, where('__name__', '==', documentId));
      
      return onSnapshot(q, (snapshot) => {
        if (snapshot.docs.length > 0) {
          const data = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          };
          callback(data);
        }
      });
    } catch (error) {
      console.error(`Error subscribing to document ${collectionName}/${documentId}:`, error);
      return () => {};
    }
  },
};

/**
 * Typed collection fetchers for common Sierra Estates collections
 */
export const collections = {
  /**
   * Fetch all stakeholders (leads)
   */
  async fetchLeads() {
    return firestoreService.fetchCollection('stakeholders', [where('stage', '!=', null)]);
  },

  /**
   * Fetch all units
   */
  async fetchUnits() {
    return firestoreService.fetchCollection('units', [where('status', '==', 'available')]);
  },

  /**
   * Fetch all proposals
   */
  async fetchProposals() {
    return firestoreService.fetchCollection('proposals');
  },

  /**
   * Fetch all concierge selections
   */
  async fetchConciergeSelections() {
    return firestoreService.fetchCollection('concierge_selections');
  },

  /**
   * Fetch pipeline statistics
   */
  async fetchPipelineStats() {
    const leads = await this.fetchLeads();
    const units = await this.fetchUnits();
    const proposals = await this.fetchProposals();

    return {
      totalLeads: leads.length,
      activeLeads: leads.filter((l) => l['stage'] !== 'closed').length,
      totalUnits: units.length,
      totalProposals: proposals.length,
      avgMatchScore: leads.length > 0
        ? leads.reduce((sum: number, l) => sum + ((l['aiProfiling'] as { topMatches?: Array<{ matchScore?: number }> })?.topMatches?.[0]?.matchScore ?? 0), 0) / leads.length
        : 0,
    };
  },

  /**
   * Subscribe to real-time updates of all leads
   */
  subscribeToLeads(callback: (leads: FirestoreDoc[]) => void): Unsubscribe {
    return firestoreService.subscribeToCollection('stakeholders', callback, [where('stage', '!=', null)]);
  },

  /**
   * Subscribe to real-time updates of all units
   */
  subscribeToUnits(callback: (units: FirestoreDoc[]) => void): Unsubscribe {
    return firestoreService.subscribeToCollection('units', callback, [where('status', '==', 'available')]);
  },

  /**
   * Subscribe to real-time updates of pipeline stats
   */
  subscribeToStats(callback: (stats: unknown) => void): Unsubscribe {
    return this.subscribeToLeads(async () => {
      const stats = await this.fetchPipelineStats();
      callback(stats);
    });
  },
};

export function useFirestoreCollection(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<FirestoreDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = firestoreService.subscribeToCollection(
      collectionName,
      (newData) => {
        if (active) {
          setData(newData);
          setLoading(false);
        }
      },
      constraints
    );

    return () => {
      active = false;
      unsubscribe();
    };
    // constraints is an array reference from the caller — including it in deps would
    // cause infinite re-renders when passed as an inline literal. Callers should
    // stabilise the array with useMemo if they need reactive constraint updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading };
}

/**
 * Fetch cached statistics for dashboard display
 */
export async function getCachedPipelineStats() {
  try {
    const stats = await collections.fetchPipelineStats();
    return stats;
  } catch (error) {
    console.error('Error fetching pipeline stats:', error);
    return null;
  }
}
