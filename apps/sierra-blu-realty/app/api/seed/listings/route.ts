import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';
import { COLLECTIONS } from '@/lib/models/schema';
import { FieldValue } from 'firebase-admin/firestore';

const SAMPLE_LISTINGS = [
  {
    title: 'Modern Luxury Villa in Fifth Settlement',
    propertyType: 'villa',
    category: 'residential',
    status: 'available',
    compound: 'Fifth Settlement',
    location: 'Fifth Settlement',
    city: 'Cairo',
    area: 450,
    bedrooms: 4,
    bathrooms: 5,
    price: 8500000,
    pricePerSqm: 18889,
    coordinates: { lat: 30.0081, lng: 31.4864 },
    finishingType: 'fully-finished',
    description: 'Stunning 4-bedroom villa with private pool, smart home automation, and breathtaking garden views.',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18a16038c?w=800',
    ],
    ownerType: 'owner',
    automation: {
      isBranded: true,
      isPublishedToPF: false,
      isPublishedToFB: false,
      whatsappAdGenerated: false,
    },
  },
  {
    title: 'Contemporary Penthouse - New Cairo',
    propertyType: 'penthouse',
    category: 'residential',
    status: 'available',
    compound: 'New Cairo',
    location: 'New Cairo',
    city: 'Cairo',
    area: 320,
    bedrooms: 3,
    bathrooms: 3,
    price: 4200000,
    pricePerSqm: 13125,
    coordinates: { lat: 30.0244, lng: 31.4894 },
    finishingType: 'fully-finished',
    description: 'Luxurious penthouse with panoramic city views, designer interiors, and state-of-the-art amenities.',
    featuredImage: 'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=800',
    images: [
      'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=800',
    ],
    ownerType: 'owner',
    automation: {
      isBranded: true,
      isPublishedToPF: false,
      isPublishedToFB: false,
      whatsappAdGenerated: false,
    },
  },
  {
    title: 'Spacious Apartment in Downtown Cairo',
    propertyType: 'apartment',
    category: 'residential',
    status: 'available',
    compound: 'Downtown Cairo',
    location: 'Downtown Cairo',
    city: 'Cairo',
    area: 180,
    bedrooms: 2,
    bathrooms: 2,
    price: 1800000,
    pricePerSqm: 10000,
    coordinates: { lat: 30.0444, lng: 31.2357 },
    finishingType: 'fully-finished',
    description: 'Elegant 2-bedroom apartment in prestigious downtown location with modern finishes.',
    featuredImage: 'https://images.unsplash.com/photo-1469022785867-ae4811ae4e3c?w=800',
    images: [
      'https://images.unsplash.com/photo-1469022785867-ae4811ae4e3c?w=800',
    ],
    ownerType: 'broker',
    automation: {
      isBranded: false,
      isPublishedToPF: true,
      isPublishedToFB: false,
      whatsappAdGenerated: false,
    },
  },
  {
    title: 'Premium Villa in Sheikh Zayed',
    propertyType: 'villa',
    category: 'residential',
    status: 'available',
    compound: 'Sheikh Zayed',
    location: 'Sheikh Zayed',
    city: 'Cairo',
    area: 500,
    bedrooms: 5,
    bathrooms: 6,
    price: 12000000,
    pricePerSqm: 24000,
    coordinates: { lat: 30.0164, lng: 30.8186 },
    finishingType: 'fully-finished',
    description: 'Exquisite 5-bedroom villa with private beach access, infinity pool, and luxury finishes.',
    featuredImage: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
    images: [
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
    ],
    ownerType: 'owner',
    automation: {
      isBranded: true,
      isPublishedToPF: false,
      isPublishedToFB: false,
      whatsappAdGenerated: false,
    },
  },
  {
    title: 'Modern Townhouse in Maadi',
    propertyType: 'townhouse',
    category: 'residential',
    status: 'available',
    compound: 'Maadi',
    location: 'Maadi',
    city: 'Cairo',
    area: 220,
    bedrooms: 3,
    bathrooms: 3,
    price: 2800000,
    pricePerSqm: 12727,
    coordinates: { lat: 30.0079, lng: 31.2632 },
    finishingType: 'fully-finished',
    description: '3-bedroom townhouse with private garden and modern design in peaceful Maadi community.',
    featuredImage: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800',
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800',
    ],
    ownerType: 'owner',
    automation: {
      isBranded: true,
      isPublishedToPF: false,
      isPublishedToFB: false,
      whatsappAdGenerated: false,
    },
  },
  {
    title: 'Luxury Apartment in Heliopolis',
    propertyType: 'apartment',
    category: 'residential',
    status: 'available',
    compound: 'Heliopolis',
    location: 'Heliopolis',
    city: 'Cairo',
    area: 200,
    bedrooms: 2,
    bathrooms: 2,
    price: 2200000,
    pricePerSqm: 11000,
    coordinates: { lat: 30.0972, lng: 31.3421 },
    finishingType: 'fully-finished',
    description: 'Spacious 2-bedroom apartment in upscale Heliopolis with excellent amenities.',
    featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    ownerType: 'broker',
    automation: {
      isBranded: false,
      isPublishedToPF: true,
      isPublishedToFB: false,
      whatsappAdGenerated: false,
    },
  },
];

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed routes are disabled in production' }, { status: 403 });
  }

  try {
    const auth = req.headers.get('Authorization');
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const batch = adminDb.batch();
    const collectionRef = adminDb.collection(COLLECTIONS.units);

    SAMPLE_LISTINGS.forEach((listing) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, {
        ...listing,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        isFeatured: Math.random() > 0.5,
      });
    });

    await batch.commit();
    return NextResponse.json({
      success: true,
      message: `Added ${SAMPLE_LISTINGS.length} sample listings`,
      count: SAMPLE_LISTINGS.length,
    });
  } catch (error) {
    console.error('Error seeding listings:', error);
    return NextResponse.json(
      { error: 'Failed to seed listings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
