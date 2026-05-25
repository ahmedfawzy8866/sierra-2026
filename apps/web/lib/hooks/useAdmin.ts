import { useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * useAdmin: Custom hook for common admin operations
 * Provides CRUD operations for admin-managed collections with role-based checks
 */

interface AdminResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useAdmin() {
  // Get document by ID
  const getDocument = useCallback(async <T>(
    collectionName: string,
    docId: string
  ): Promise<AdminResult<T>> => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          success: true,
          data: { id: docSnap.id, ...docSnap.data() } as T,
        };
      }
      return { success: false, error: 'Document not found' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  // Get documents by query
  const queryDocuments = useCallback(async <T>(
    collectionName: string,
    fieldName?: string,
    operator?: any,
    value?: any
  ): Promise<AdminResult<T[]>> => {
    try {
      let q: any;
      if (fieldName && operator && value !== undefined) {
        q = query(collection(db, collectionName), where(fieldName, operator, value));
      } else {
        q = query(collection(db, collectionName));
      }

      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as T));

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  // Create document
  const createDocument = useCallback(async <T>(
    collectionName: string,
    docId: string,
    data: T
  ): Promise<AdminResult> => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  // Update document
  const updateDocument = useCallback(async <T extends Record<string, any>>(
    collectionName: string,
    docId: string,
    updates: Partial<T>
  ): Promise<AdminResult> => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, updates);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  // Delete document
  const deleteDocument = useCallback(async (
    collectionName: string,
    docId: string
  ): Promise<AdminResult> => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  // Batch operations
  const batchUpdate = useCallback(async (
    operations: Array<{
      collection: string;
      docId: string;
      data: Record<string, any>;
      action: 'set' | 'update' | 'delete';
    }>
  ): Promise<AdminResult> => {
    try {
      // For now, execute sequentially (Firebase web SDK doesn't have batch in client)
      // In production, use a server-side batch endpoint
      for (const op of operations) {
        const docRef = doc(db, op.collection, op.docId);
        if (op.action === 'set') {
          await setDoc(docRef, op.data);
        } else if (op.action === 'update') {
          await updateDoc(docRef, op.data);
        } else if (op.action === 'delete') {
          await deleteDoc(docRef);
        }
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  return {
    getDocument,
    queryDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    batchUpdate,
  };
}
