import * as functions from 'firebase-functions';

// HTTP API route
export const api = functions.https.onRequest((req, res) => {
  res.json({ message: 'Sierra Estates API - Health check OK' });
});

// Health check function
export const healthCheck = functions.pubsub
  .schedule('0 * * * *')
  .onRun(async () => {
    console.log('Health check running...');
    return null;
  });

// Batch processor
export const processBatch = functions.pubsub
  .topic('batch-jobs')
  .onPublish(async (message) => {
    console.log('Processing batch job:', message.data);
    return null;
  });
