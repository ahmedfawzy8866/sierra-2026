import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';
import crypto from 'crypto';

/**
 * POST /api/crm/property-finder
 * Securely normalizes real estate landlord row metrics from your spreadsheets.
 * Prevents entry duplicates via SHA256 sync_hash lookups and splits relational collections.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { rows } = payload;
    const migrationSummaryLogs = [];

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: rows must be an array.' },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: rows array cannot be empty.' },
        { status: 400 }
      );
    }

    // Safe environment lookups protect credentials from source code exposure
    const apiKey = process.env.PF_API_KEY;
    const apiSecret = process.env.PF_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: "Missing system access configuration tokens" }, { status: 500 });
    }

    for (const row of rows) {
      // 1. Enforce phone string sanitization to clean 11-digit local formatting lines
      let cleanMobileId = String(row.Mobile || '').replace(/[\s\-\+\(\)]/g, '').trim();
      if (cleanMobileId.startsWith('20')) cleanMobileId = cleanMobileId.substring(2);
      if (cleanMobileId.startsWith('0020')) cleanMobileId = cleanMobileId.substring(4);
      if (!cleanMobileId.startsWith('0') && cleanMobileId.length === 10) cleanMobileId = '0' + cleanMobileId;

      // 2. Deterministic sync key: sync_hash = SHA256(normalized Location-RentPeriodType-Code-Owner raw payload tuple)
      const location = String(row.Location || 'New Cairo').trim();
      const spaceBua = String(row.RentPeriodType || '150').trim(); 
      const codeField = String(row.Code || '0').trim(); 
      const ownerField = String(row.Owner || 'Direct Investor').trim();

      const rawTokenSignature = `${location}-${spaceBua}-${codeField}-${ownerField}`.toLowerCase().trim();
      const computedSyncHash = crypto.createHash('sha256').update(rawTokenSignature).digest('hex');

      const propertyDocumentRef = adminDb.collection('Properties').doc(computedSyncHash);
      const docSnapshot = await propertyDocumentRef.get();

      // 3. Synthesize uniform SBR tracking code using formula: Prefix-Rooms[Furnish]-Price
      const compPrefix = location.substring(0, 3).toUpperCase();
      const furnishTag = row.Furniture === 'Fully Finished with Furniture' || row.Furniture === 'Furnished' ? 'F' : 'U';
      const parsedPrice = typeof row.UnitPrice === 'number' ? row.UnitPrice : parseFloat(String(row.UnitPrice || '0').replace(/[^0-9]/g, ''));
      const priceAbbrev = parsedPrice >= 1000000 ? `${(parsedPrice / 1000000).toFixed(0)}M` : `${(parsedPrice / 1000).toFixed(0)}K`;
      const sbrUniformCode = `${compPrefix}-${row.BedRooms || '3'}${furnishTag}-${priceAbbrev}`;

      const normalizedPropertyPayload = {
        id: computedSyncHash,
        unit_code: sbrUniformCode,
        pf_reference_id: codeField || `SBR-AUTO-${computedSyncHash.substring(0, 5).toUpperCase()}`,
        compound_name: location,
        title_en: row.Name || `Luxury Property in ${location}`,
        title_ar: row.PropertyType === 'Villa' ? 'فيلا مستقلة فاخرة' : 'شقة سكنية موثقة العرض',
        price: parsedPrice,
        currency: "EGP",
        purpose: String(row.Availability || '').toUpperCase() === 'RESALE' ? 'RESALE' : 'RENT',
        beds: parseInt(row.BedRooms || '3'),
        bua_m2: parseFloat(spaceBua),
        furnished_status: furnishTag,
        sync_hash: computedSyncHash,
        pf_status: "PUBLISHED",
        owner_id: cleanMobileId, // Central relationship index mapping back to clean Owners schema collection
        agent_name: row.AgentName || "Ahmed Fawzy",
        last_sync_timestamp: new Date().toISOString()
      };

      // Create an intake session buffer log with expireAt (e.g. expires in 7 days for auto-purging)
      const purgeTimestamp = new Date();
      purgeTimestamp.setDate(purgeTimestamp.getDate() + 7);

      const sessionBufferRef = adminDb.collection('SessionLogs').doc(`LOG-${computedSyncHash}`);
      await sessionBufferRef.set({
        sync_hash: computedSyncHash,
        status: docSnapshot.exists ? "MERGED_UPDATE" : "NEW_INGEST",
        timestamp: new Date().toISOString(),
        expireAt: purgeTimestamp.toISOString() // Authorized zero-cost Firestore purge rule index
      });

      if (docSnapshot.exists) {
        // Prevent stale tracking lists by updating price indices while preserving historical metadata templates
        await propertyDocumentRef.update({
          price: normalizedPropertyPayload.price,
          last_sync_timestamp: normalizedPropertyPayload.last_sync_timestamp
        });
        migrationSummaryLogs.push({ sync_hash: computedSyncHash, state: "DEDUPLICATION_MUTATED_PRICE" });
      } else {
        // Write fresh independent property node structure
        await propertyDocumentRef.set(normalizedPropertyPayload);
        
        // Write detached owner profile data using phone ID as the canonical document record ID
        const ownerDocumentRef = adminDb.collection('Owners').doc(cleanMobileId);
        await ownerDocumentRef.set({
          id: cleanMobileId,
          owner_name: ownerField,
          primary_mobile: cleanMobileId,
          last_sync_timestamp: normalizedPropertyPayload.last_sync_timestamp
        }, { merge: true });

        migrationSummaryLogs.push({ sync_hash: computedSyncHash, state: "DEDUPLICATION_NEW_RECORD_COMMITTED" });
      }
    }

    return NextResponse.json({ success: true, tracking_summary: migrationSummaryLogs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected sync failure';
    return NextResponse.json({ success: false, error: `Property finder sync failed: ${message}` }, { status: 500 });
  }
}
