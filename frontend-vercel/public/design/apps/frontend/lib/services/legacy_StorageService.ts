import { adminApp, isAdminInitialized } from '../server/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

/**
 * SIERRA ESTATES STORAGE SERVICE
 * Manages institutional asset storage with high-integrity pathing.
 */
export class StorageService {
  private static _bucket: any = null;

  private static getBucket() {
    if (this._bucket) return this._bucket;
    if (!isAdminInitialized) {
      throw new Error('Firebase Admin SDK not initialized — storage unavailable.');
    }
    const { getStorage } = require('firebase-admin/storage');
    const storage = getStorage(adminApp);
    this._bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    return this._bucket;
  }

  /**
   * Uploads base64 media to Firebase Storage.
   * Path: properties/{docId}/{filename}
   */
  static async uploadPropertyMedia(
    docId: string, 
    base64Data: string, 
    mimeType: string, 
    originalName: string = 'upload.jpg'
  ): Promise<string> {
    const extension = mimeType.split('/')[1] || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    const filePath = `properties/${docId}/${filename}`;
    const file = this.getBucket().file(filePath);

    const buffer = Buffer.from(base64Data, 'base64');

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName,
          docId,
          source: 'whatsapp'
        }
      },
      public: true
    });

    // Return the public URL
    // Note: In production, you might want to use signed URLs or Firebase's download tokens
    return `https://storage.googleapis.com/${this.getBucket().name}/${filePath}`;
  }
}
