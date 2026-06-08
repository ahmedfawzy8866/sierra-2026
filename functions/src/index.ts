import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin (guard against double-init in tests)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ── Health check (HTTP) ────────────────────────────────────
export const api = functions.https.onRequest((req, res) => {
  res.json({ message: 'Sierra Estates API - Health check OK' });
});

// ── Scheduled health ping ──────────────────────────────────
export const healthCheck = functions.pubsub
  .schedule('0 * * * *')
  .onRun(async () => {
    console.log('Health check running...');
    return null;
  });

// ── Batch processor (Pub/Sub) ──────────────────────────────
export const processBatch = functions.pubsub
  .topic('batch-jobs')
  .onPublish(async (message) => {
    console.log('Processing batch job:', message.data);
    return null;
  });

// ── Data Collection Workflow ───────────────────────────────
// HTTP endpoint used exclusively by scrapers.
// Dumps raw data into `rawScrapeData`; the frontend has NO access to this collection.
export const collectData = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    const payload = req.body as Record<string, unknown>;
    if (!payload || typeof payload !== 'object') {
      res.status(400).send('Invalid payload');
      return;
    }
    const docRef = await db.collection('rawScrapeData').add({
      ...payload,
      collectedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'raw_unprocessed',
    });
    console.log(`Raw data ingested from scraper: ${docRef.id}`);
    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Data collection error:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// ── Data Processing Workflow ───────────────────────────────
// Listens for new documents in `rawScrapeData`, normalises them,
// and writes to `processedData` (which the app can read).
export const processDataForApp = functions.firestore
  .document('rawScrapeData/{docId}')
  .onCreate(async (snap, context) => {
    const rawData = snap.data();
    const docId = context.params.docId as string;
    console.log(`Processing raw document ${docId}...`);
    try {
      const processedData = {
        title: (rawData.title as string) || 'Untitled Property',
        price: parseFloat(rawData.price as string) || 0,
        location: (rawData.location as string) || 'Unknown',
        source: (rawData.source as string) || 'Scraper Bot',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        isAvailable: true,
      };
      await db.collection('processedData').doc(docId).set(processedData);
      await snap.ref.update({ status: 'processed_success' });
      console.log(`Document ${docId} processed and saved to processedData.`);
    } catch (error) {
      console.error(`Error processing document ${docId}:`, error);
      await snap.ref.update({ status: 'processed_error', error: String(error) });
    }
  });
