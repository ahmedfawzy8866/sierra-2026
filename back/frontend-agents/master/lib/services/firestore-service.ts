/**
 * SIERRA BLU — FIRESTORE SERVICE LAYER
 * Generic CRUD operations for all collections.
 * Type-safe wrappers around Firestore Admin SDK.
 */

import { adminDb } from '../server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { COLLECTIONS, type BaseDocument } from '../models/schema';

// ─── Generic CRUD ────────────────────────────────────────────────────

/**
 * Create a document in a collection.
 */
export async function createDocument<T extends BaseDocument>(
  collectionName: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await adminDb.collection(collectionName).add({
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Get a single document by ID.
 */
export async function getDocument<T extends BaseDocument>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docSnap = await adminDb.collection(collectionName).doc(docId).get();
  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as T;
}

/**
 * Update a document by ID (partial update).
 */
export async function updateDocument<T extends BaseDocument>(
  collectionName: string,
  docId: string,
  data: Partial<Omit<T, 'id' | 'createdAt'>>
): Promise<void> {
  await adminDb.collection(collectionName).doc(docId).update({
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete a document by ID.
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  await adminDb.collection(collectionName).doc(docId).delete();
}

// ─── Query Helpers ───────────────────────────────────────────────────

export interface QueryOptions {
  filters?: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: unknown }>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  startAfterDoc?: FirebaseFirestore.DocumentSnapshot;
}

/**
 * Query documents with filters, sorting, and pagination.
 */
export async function queryDocuments<T extends BaseDocument>(
  collectionName: string,
  options: QueryOptions = {}
): Promise<{ data: T[]; lastDoc: FirebaseFirestore.DocumentSnapshot | null }> {
  let q: FirebaseFirestore.Query = adminDb.collection(collectionName);

  // Add filters
  if (options.filters) {
    for (const f of options.filters) {
      q = q.where(f.field, f.op, f.value);
    }
  }

  // Add sorting
  if (options.sortBy) {
    q = q.orderBy(options.sortBy, options.sortDirection || 'desc');
  }

  // Add pagination
  if (options.pageSize) {
    q = q.limit(options.pageSize);
  }

  if (options.startAfterDoc) {
    q = q.startAfter(options.startAfterDoc);
  }

  const snapshot = await q.get();
  const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { data, lastDoc };
}

/**
 * Subscribe to real-time updates on a collection.
 * Note: Admin SDK supports onSnapshot for server-side listeners.
 */
export function subscribeToCollection<T extends BaseDocument>(
  collectionName: string,
  callback: (data: T[]) => void,
  options: Omit<QueryOptions, 'startAfterDoc'> = {}
): () => void {
  let q: FirebaseFirestore.Query = adminDb.collection(collectionName);

  if (options.filters) {
    for (const f of options.filters) {
      q = q.where(f.field, f.op, f.value);
    }
  }

  if (options.sortBy) {
    q = q.orderBy(options.sortBy, options.sortDirection || 'desc');
  }

  if (options.pageSize) {
    q = q.limit(options.pageSize);
  }

  return q.onSnapshot((snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
    callback(data);
  });
}

// ─── Collection-Specific Shortcuts ──────────────────────────────────

export const Units = {
  create: (data: Parameters<typeof createDocument>[1]) => createDocument(COLLECTIONS.units, data),
  get: (id: string) => getDocument(COLLECTIONS.units, id),
  update: (id: string, data: Parameters<typeof updateDocument>[2]) => updateDocument(COLLECTIONS.units, id, data),
  remove: (id: string) => deleteDocument(COLLECTIONS.units, id),
  query: (opts?: QueryOptions) => queryDocuments(COLLECTIONS.units, opts),
  subscribe: (cb: Parameters<typeof subscribeToCollection>[1], opts?: Parameters<typeof subscribeToCollection>[2]) =>
    subscribeToCollection(COLLECTIONS.units, cb, opts),
};

export const Projects = {
  create: (data: Parameters<typeof createDocument>[1]) => createDocument(COLLECTIONS.projects, data),
  get: (id: string) => getDocument(COLLECTIONS.projects, id),
  update: (id: string, data: Parameters<typeof updateDocument>[2]) => updateDocument(COLLECTIONS.projects, id, data),
  remove: (id: string) => deleteDocument(COLLECTIONS.projects, id),
  query: (opts?: QueryOptions) => queryDocuments(COLLECTIONS.projects, opts),
  subscribe: (cb: Parameters<typeof subscribeToCollection>[1], opts?: Parameters<typeof subscribeToCollection>[2]) =>
    subscribeToCollection(COLLECTIONS.projects, cb, opts),
};

export const Developers = {
  create: (data: Parameters<typeof createDocument>[1]) => createDocument(COLLECTIONS.developers, data),
  get: (id: string) => getDocument(COLLECTIONS.developers, id),
  update: (id: string, data: Parameters<typeof updateDocument>[2]) => updateDocument(COLLECTIONS.developers, id, data),
  remove: (id: string) => deleteDocument(COLLECTIONS.developers, id),
  query: (opts?: QueryOptions) => queryDocuments(COLLECTIONS.developers, opts),
  subscribe: (cb: Parameters<typeof subscribeToCollection>[1], opts?: Parameters<typeof subscribeToCollection>[2]) =>
    subscribeToCollection(COLLECTIONS.developers, cb, opts),
};

export const Leads = {
  create: (data: Parameters<typeof createDocument>[1]) => createDocument(COLLECTIONS.stakeholders, data),
  get: (id: string) => getDocument(COLLECTIONS.stakeholders, id),
  update: (id: string, data: Parameters<typeof updateDocument>[2]) => updateDocument(COLLECTIONS.stakeholders, id, data),
  remove: (id: string) => deleteDocument(COLLECTIONS.stakeholders, id),
  query: (opts?: QueryOptions) => queryDocuments(COLLECTIONS.stakeholders, opts),
  subscribe: (cb: Parameters<typeof subscribeToCollection>[1], opts?: Parameters<typeof subscribeToCollection>[2]) =>
    subscribeToCollection(COLLECTIONS.stakeholders, cb, opts),
};
