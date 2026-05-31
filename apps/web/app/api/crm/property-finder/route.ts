import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';
import crypto from 'crypto';

/**
 * POST /api/crm/property-finder
 * Processes the 13 canonical owner/portal spreadsheet data rows.
 * Normalizes Egyptian mobile formats, verifies hashes to block broker duplication,
 * and splits entities into normalized collection structures.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rows } = body; 
    const executionLogs = [];

    for (const row of rows) {
      // 1. Phone number normalization to 01x standard strings
      let cleanMobile = String(row.Mobile || '').replace(/[\s\-\+\(\)]/g, '').trim();
      if (cleanMobile.startsWith('20')) cleanMobile = cleanMobile.substring(2);
      if (cleanMobile.startsWith('0020')) cleanMobile = cleanMobile.substring(4);
      if (!cleanMobile.startsWith('0') && cleanMobile.length === 10) cleanMobile = '0' + cleanMobile;

      // 2. Cryptographic signature hash computation (SHA256 signature algorithm check)
      const location = String(row.Location || 'New Cairo').trim();
      const buaSpace = String(row.RentPeriodType || '180').trim(); 
      const codeField = String(row.Code || '0').trim(); 
      const ownerField = String(row.Owner || 'Unknown Direct Investor').trim();

      const tokenSignature = `${location}-${buaSpace}-${codeField}-${ownerField}`.toLowerCase().trim();
      const sync_hash = crypto.createHash('sha256').update(tokenSignature).digest('hex');

      const propertyRef = adminDb.collection('Properties').doc(sync_hash);
      const docSnapshot = await propertyRef.get();

      // 3. Uniform Sierra Code Engine synthesis
      const compPrefix = location.substring(0, 3).toUpperCase();
      const furnishTag = row.Furniture === 'Fully Finished with Furniture' || row.Furniture === 'Furnished' ? 'F' : 'U';
      const parsedPrice = parseFloat(String(row.UnitPrice || '0').replace(/[^0-9]/g, ''));
      const priceAbbrev = parsedPrice >= 1000000 ? `${(parsedPrice / 1000000).toFixed(0)}M` : `${(parsedPrice / 1000).toFixed(0)}K`;
      const generatedSbrCode = `${compPrefix}-${row.BedRooms || 'X'}${furnishTag}-${priceAbbrev}`;

      const propertyPayload = {
        id: sync_hash,
        unit_code: generatedSbrCode,
        pf_reference_id: codeField || `SBR-AUTO-${sync_hash.substring(0, 5).toUpperCase()}`,
        compound_name: location,
        title_en: row.Name || `Luxury Property in ${location}`,
        price: parsedPrice,
        currency: "EGP",
        purpose: String(row.Availability || '').toUpperCase() === 'RESALE' ? 'RESALE' : 'RENT',
        beds: parseInt(row.BedRooms || '3'),
        bua_m2: parseFloat(buaSpace),
        furnished_status: furnishTag,
        sync_hash,
        pf_status: "PUBLISHED",
        owner_id: cleanMobile, // Relational connection key pointing to clean Owners table document
        last_sync_timestamp: new Date().toISOString()
      };

      if (docSnapshot.exists) {
        // Record exists: update dynamic values to capture fresh changes without overwriting metadata
        await propertyRef.update({
          price: propertyPayload.price,
          last_sync_timestamp: propertyPayload.last_sync_timestamp
        });
        executionLogs.push({ sync_hash, status: "UPDATED_REALTIME_PRICE" });
      } else {
        // Record unique: instantiate entities split across relational schemas safely
        await propertyRef.set(propertyPayload);
        
        const ownerRef = adminDb.collection('Owners').doc(cleanMobile);
        await ownerRef.set({
          id: cleanMobile,
          owner_name: ownerField,
          primary_mobile: cleanMobile,
          last_sync: propertyPayload.last_sync_timestamp
        }, { merge: true });

        executionLogs.push({ sync_hash, status: "COMMITTED_NEW_RECORD" });
      }
    }

    return NextResponse.json({ success: true, telemetry_log: executionLogs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
