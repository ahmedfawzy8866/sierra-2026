import { NextResponse } from 'next/server';
import { COLLECTIONS } from '@/lib/models/schema';
import { applyRateLimit, publicEndpointLimiter } from '@/lib/server/rate-limit';

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBZLN2jTTKV34SneGPoWRz1zoRpX5uODjs';
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sierra-blu';

interface FirestoreValue {
  [key: string]: any;
}

interface FirestoreDocument {
  name?: string;
  fields?: { [key: string]: FirestoreValue };
}

/**
 * Extract value from Firestore document field
 */
function extractValue(field: FirestoreValue): any {
  if (!field) return undefined;
  if (field.stringValue) return field.stringValue;
  if (field.integerValue) return parseInt(field.integerValue, 10);
  if (field.doubleValue) return field.doubleValue;
  if (field.booleanValue) return field.booleanValue;
  if (field.arrayValue?.values) {
    return field.arrayValue.values.map(extractValue);
  }
  if (field.mapValue?.fields) {
    const obj: any = {};
    for (const [key, val] of Object.entries(field.mapValue.fields)) {
      obj[key] = extractValue(val as FirestoreValue);
    }
    return obj;
  }
  return undefined;
}

/**
 * Query Firestore via REST API
 */
async function queryFirestoreRest(
  collectionName: string,
  limit?: number,
  docId?: string
): Promise<{ doc?: FirestoreDocument; docs: FirestoreDocument[] } | null> {
  try {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}`
    );

    if (docId) {
      url.pathname += `/${docId}`;
    } else if (limit) {
      url.searchParams.append('pageSize', limit.toString());
    }
    url.searchParams.append('key', API_KEY);

    const response = await fetch(url.toString(), { method: 'GET' });

    if (!response.ok) {
      console.error(`[FIRESTORE_REST] ${response.status}: ${await response.text()}`);
      return null;
    }

    const data = await response.json();

    if (docId) {
      // Single document response
      return { doc: data, docs: [] };
    } else {
      // Collection query response
      return { docs: data.documents || [] };
    }
  } catch (error: any) {
    console.error('[FIRESTORE_REST_ERROR]', error?.message || error);
    return null;
  }
}

/**
 * Transform Firestore document to listing object
 */
function transformToListing(doc: FirestoreDocument): any {
  if (!doc || !doc.fields) return null;

  const fields = doc.fields;
  const id = doc.name?.split('/').pop() || '';

  return {
    id,
    title: extractValue(fields.title) || 'Untitled Property',
    price: extractValue(fields.price) || 0,
    compound: extractValue(fields.compound) || extractValue(fields.location) || extractValue(fields.city) || '',
    beds: extractValue(fields.bedrooms) || 0,
    baths: extractValue(fields.bathrooms) || 0,
    area: extractValue(fields.area) || 0,
    image: (extractValue(fields.images)?.[0]) || undefined,
    images: extractValue(fields.images) || [],
    description: extractValue(fields.description) || undefined,
    propertyType: extractValue(fields.propertyType) || extractValue(fields.type) || 'apartment',
    status: extractValue(fields.status) || 'available',
    pfReferenceNumber: extractValue(fields.pfReferenceNumber) || null,
  };
}

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, publicEndpointLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await queryFirestoreRest(COLLECTIONS.units, undefined, id);
      if (!result?.doc) {
        return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
      }
      const listing = transformToListing(result.doc);
      return NextResponse.json({ success: true, listing });
    }

    const limitParam = parseInt(searchParams.get('limit') || '12', 10);
    const result = await queryFirestoreRest(COLLECTIONS.units, limitParam);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch listings from database' },
        { status: 500 }
      );
    }

    const listings = (result.docs || []).map(transformToListing).filter(Boolean);

    return NextResponse.json({ success: true, listings, count: listings.length });
  } catch (error: any) {
    console.error('[LISTINGS_ERROR] Failed to fetch listings:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
