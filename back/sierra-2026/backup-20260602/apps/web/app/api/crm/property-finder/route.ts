import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { rows } = payload; 
    const migrationSummaryLogs = [];

    const apiKey = process.env.PF_API_KEY;
    const apiSecret = process.env.PF_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ success: false, message: "Security Integrity Refused: Unpopulated environment variables." }, { status: 500 });
    }

    for (const row of rows) {
      // 1. Phone number sanitization loop to clean 11-digit local Egyptian lines
      let cleanMobileId = String(row.Mobile || '').replace(/[\s\-\+\(\)]/g, '').trim();
      if (cleanMobileId.startsWith('20')) cleanMobileId = cleanMobileId.substring(2);
      if (cleanMobileId.startsWith('0020')) cleanMobileId = cleanMobileId.substring(4);
      if (!cleanMobileId.startsWith('0') && cleanMobileId.length === 10) cleanMobileId = '0' + cleanMobileId;

      // 2. Cryptographic signature generation: sync_hash = SHA256(Location + BUA Area + Code + Owner)
      const location = String(row.Location || 'New Cairo').trim();
      const spaceBua = String(row.RentPeriodType || '150').trim(); 
      const codeField = String(row.Code || '0').trim(); 
      const ownerField = String(row.Owner || 'Direct Investor').trim();

      const rawTokenSignature = `${location}-${spaceBua}-${codeField}-${ownerField}`.toLowerCase().trim();
      const computedSyncHash = crypto.createHash('sha256').update(rawTokenSignature).digest('hex');

      const propertyDocumentRef = doc(db, 'Properties', computedSyncHash);
      const snapshotInstance = await getDoc(propertyDocumentRef);

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
        owner_id: cleanMobileId,
        agent_name: row.AgentName || "Ahmed Fawzy",
        last_sync_timestamp: new Date().toISOString()
      };

      if (snapshotInstance.exists()) {
        await updateDoc(propertyDocumentRef, {
          price: normalizedPropertyPayload.price,
          last_sync_timestamp: normalizedPropertyPayload.last_sync_timestamp
        });
        migrationSummaryLogs.push({ sync_hash: computedSyncHash, state: "DEDUPLICATION_MUTATED_PRICE" });
      } else {
        await setDoc(propertyDocumentRef, normalizedPropertyPayload);
        
        const ownerDocumentRef = doc(db, 'Owners', cleanMobileId);
        await setDoc(ownerDocumentRef, {
          id: cleanMobileId,
          owner_name: ownerField,
          primary_mobile: cleanMobileId,
          last_sync_timestamp: normalizedPropertyPayload.last_sync_timestamp
        }, { merge: true });

        migrationSummaryLogs.push({ sync_hash: computedSyncHash, state: "DEDUPLICATION_NEW_RECORD_COMMITTED" });
      }

      // Write short-lived tracking counters utilizing a strict 7-day Firestore TTL index expiration parameters
      const sessionBufferLogId = `LOG-BUF-${computedSyncHash}-${Date.now()}`;
      const logBufferDocRef = doc(db, 'SessionBufferLogs', sessionBufferLogId);
      const expirationTimestamp = Timestamp.fromMillis((Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)) * 1000);

      await setDoc(logBufferDocRef, {
        id: sessionBufferLogId,
        target_sync_hash: computedSyncHash,
        event_type: "SPREADSHEET_ROW_INGESTION",
        agent_identity: "Sierra AI Ingestion Pipeline",
        createdAt: new Date().toISOString(),
        expireAt: expirationTimestamp
      });
    }

    return NextResponse.json({ success: true, tracking_summary: migrationSummaryLogs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
