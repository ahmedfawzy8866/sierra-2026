import { Deal } from '../../lib/models/deals';
import theme from '../../documents/themes/sierra-blu-quiet-luxury.json';
import { adminApp } from '../../lib/server/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

export class ProposalGenerator {
  private bucket: ReturnType<ReturnType<typeof getStorage>['bucket']> | null = null;

  private getBucket() {
    if (this.bucket) {
      return this.bucket;
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || adminApp.options.storageBucket;
    if (!bucketName) {
      throw new Error('Firebase storage bucket is not configured.');
    }

    this.bucket = getStorage(adminApp).bucket(bucketName);
    return this.bucket;
  }

  /**
   * Generates a branded proposal PDF from a deal snapshot.
   */
  async generate(deal: Deal, lead: any, property: any): Promise<string> {
    console.log(`[ProposalGenerator] Generating luxury proposal for Deal ${deal.id}`);

    // 1. Prepare data payload
    const payload = {
      title: `Investment Proposal: ${property.title}`,
      leadName: lead.name,
      propertyDetails: {
        address: property.location,
        price: deal.terms.offerPrice,
        area: property.area,
        bedrooms: property.bedrooms,
      },
      terms: deal.terms,
      branding: theme.palette,
    };

    // 2. Logic to generate DOCX/PDF
    // (This would use a library like docxtemplater or similar)
    const generatedContent = Buffer.from(JSON.stringify(payload)); // Placeholder

    // 3. Upload to Firebase Storage
    const bucket = this.getBucket();
    const filePath = `proposals/${deal.id}_proposal.pdf`;
    const file = bucket.file(filePath);

    await file.save(generatedContent, {
      contentType: 'application/pdf',
      resumable: false,
    });

    return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  }

  /**
   * Generates a formal offer letter for the seller.
   */
  async generateOfferLetter(deal: Deal, sellerName: string): Promise<string> {
    console.log(`[ProposalGenerator] Generating offer letter for Seller ${sellerName}`);
    return "https://storage.sierra-blu.com/offers/placeholder.pdf";
  }
}

export const proposalGenerator = new ProposalGenerator();
