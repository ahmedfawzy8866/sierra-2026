import { adminDb } from '../server/firebase-admin';
import { COLLECTIONS, Unit } from '../models/schema';
import { mapRowToUnit } from './listing-normalize';

/**
 * AIRTABLE INTEGRATION
 *
 * Pulls property listings from one or more Airtable tables into the Firestore
 * inventory, mirroring the Google Sheets ingestion path. Records are upserted
 * by their reference code so re-syncing is idempotent.
 *
 * Configuration (env):
 *   AIRTABLE_API_KEY    — personal access token (Bearer)
 *   AIRTABLE_BASE_ID    — base id, e.g. "appXXXXXXXXXXXXXX"
 *   AIRTABLE_TABLE_NAME — table name, or a comma-separated list of tables
 *                         (e.g. "Owners-Rent,Owners-Resale,Brokers,Team Units")
 */

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

export interface AirtableSyncResult {
  success: boolean;
  table?: string;
  syncedCount?: number;
  errorCount?: number;
  fetched?: number;
  timestamp?: string;
  error?: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tables: string[];
}

export class AirtableIntegrationService {
  /** Reads + validates Airtable config from the environment. */
  static getConfig(): AirtableConfig | null {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableEnv = process.env.AIRTABLE_TABLE_NAME;
    if (!apiKey || !baseId || !tableEnv) return null;
    const tables = tableEnv.split(',').map((t) => t.trim()).filter(Boolean);
    if (tables.length === 0) return null;
    return { apiKey, baseId, tables };
  }

  /** Infers the listing owner type from the Airtable table name. */
  static ownerTypeForTable(table: string): Unit['ownerType'] {
    const t = table.toLowerCase();
    if (t.includes('broker')) return 'broker';
    if (t.includes('team') || t.includes('internal')) return 'internal';
    return 'owner';
  }

  /**
   * Fetches every record from a single Airtable table, following Airtable's
   * cursor pagination (`offset`) until exhausted.
   */
  static async fetchTableRecords(
    cfg: Pick<AirtableConfig, 'apiKey' | 'baseId'>,
    table: string,
  ): Promise<AirtableRecord[]> {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const url = new URL(`${AIRTABLE_API_BASE}/${cfg.baseId}/${encodeURIComponent(table)}`);
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${cfg.apiKey}` },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Airtable API ${res.status} for table "${table}": ${body.slice(0, 200)}`);
      }

      const json = (await res.json()) as { records?: AirtableRecord[]; offset?: string };
      if (Array.isArray(json.records)) records.push(...json.records);
      offset = json.offset;
    } while (offset);

    return records;
  }

  /** Syncs a single Airtable table into Firestore. */
  static async syncTable(
    cfg: Pick<AirtableConfig, 'apiKey' | 'baseId'>,
    table: string,
  ): Promise<AirtableSyncResult> {
    try {
      console.log(`[AirtableIntegrationService] Syncing table "${table}"...`);
      const records = await this.fetchTableRecords(cfg, table);
      const ownerType = this.ownerTypeForTable(table);

      const unitsCollection = adminDb.collection(COLLECTIONS.units);
      const batch = adminDb.batch();
      let syncedCount = 0;
      let errorCount = 0;

      for (const record of records) {
        try {
          const unit = mapRowToUnit(record.fields, { ownerType, syncSource: 'airtable' });
          if (!unit) continue;

          let docRef;
          if (unit.referenceNumber) {
            const existing = await unitsCollection
              .where('referenceNumber', '==', unit.referenceNumber)
              .limit(1)
              .get();
            docRef = existing.empty ? unitsCollection.doc() : existing.docs[0].ref;
          } else {
            docRef = unitsCollection.doc();
          }

          batch.set(docRef, unit, { merge: true });
          syncedCount++;
        } catch (_err) {
          errorCount++;
        }
      }

      await batch.commit();
      console.log(`[AirtableIntegrationService] "${table}": synced ${syncedCount}, errors ${errorCount}.`);

      return {
        success: true,
        table,
        fetched: records.length,
        syncedCount,
        errorCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[AirtableIntegrationService] Sync failed for "${table}":`, message);
      return { success: false, table, error: message };
    }
  }

  /**
   * Syncs every configured table. Returns a per-table breakdown plus rolled-up
   * totals. Throws a descriptive error if Airtable is not configured.
   */
  static async syncFromEnv(): Promise<{
    success: boolean;
    totalSynced: number;
    totalErrors: number;
    tables: AirtableSyncResult[];
    timestamp: string;
  }> {
    const cfg = this.getConfig();
    if (!cfg) {
      throw new Error(
        'Airtable is not configured. Set AIRTABLE_API_KEY, AIRTABLE_BASE_ID and AIRTABLE_TABLE_NAME.',
      );
    }

    const results: AirtableSyncResult[] = [];
    for (const table of cfg.tables) {
      results.push(await this.syncTable(cfg, table));
    }

    return {
      success: results.every((r) => r.success),
      totalSynced: results.reduce((sum, r) => sum + (r.syncedCount ?? 0), 0),
      totalErrors: results.reduce((sum, r) => sum + (r.errorCount ?? 0), 0),
      tables: results,
      timestamp: new Date().toISOString(),
    };
  }
}
