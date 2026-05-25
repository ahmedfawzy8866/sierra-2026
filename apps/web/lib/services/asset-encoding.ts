/**
 * SIERRA BLU — ASSET ENCODING SERVICE
 * Implements the "Encoding Program" logic for rapid unit registration via copy-paste.
 */

import { GoogleAIService } from '../server/google-ai';
import { Unit, PropertyType, PropertyStatus } from '../models/schema';

export interface EncodedAsset extends Partial<Unit> {
  rawText: string;
}

/**
 * Parses raw copied listing information into the Sierra Blu Unit schema.
 * Uses the "Sierra Codification Protocol."
 */
export async function encodeListingFromText(rawText: string): Promise<Partial<Unit>> {
  const systemPrompt = `ROLE: You are "Sierra," the Lead Logic Agent for Asset Registration at Sierra Blu.
TASK: Extract structured property details from raw text (WhatsApp, OLX, or PDFs).

EXTRACTION PROTOCOL:
- "title": Professional, luxury title (English).
- "propertyType": One of "apartment", "villa", "townhouse", "duplex", "penthouse", "studio", "chalet", "commercial", "land".
- "status": Default to "available".
- "compound": The community name.
- "area": Size in sqm (number).
- "bedrooms": Number of rooms.
- "bathrooms": Number of bathrooms.
- "price": Total price in EGP (number).
- "finishingType": One of "fully-finished", "semi-finished", "core-shell", "not-finished".
- "description": Concise, luxury description (English).
- "code": Generate unique code: SB-[COMPOUND-ID]-[TYPE-ABBR]-[SQM].

TONE: Institutional, Precise, Data-Driven.
FORMAT: Return ONLY a JSON object.`;

  try {
    const data = await GoogleAIService.chatCompletions(
      'scribe', 'asset-encoding',
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Encode this listing information: ${rawText}` }
      ],
      { model: 'gemini-1.5-flash', temperature: 0.1 }
    );

    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Unable to parse encoding results.');

    return JSON.parse(jsonMatch[0]) as Partial<Unit>;
  } catch (err) {
    console.error('[AssetEncoding] Extraction error:', err);
    throw err;
  }
}
