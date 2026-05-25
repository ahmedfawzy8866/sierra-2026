'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface MigrationStatus {
  migrationInProgress: boolean;
  lastMigration: any;
  timestamp: string;
}

interface ValidationStatus {
  valid: boolean;
  issues: string[];
  totalIssues: number;
  validatedAt: string;
}

export default function AdminMigrationPage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [validation, setValidation] = useState<ValidationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [showResults, setShowResults] = useState(false);

  // Load current status
  useEffect(() => {
    fetchStatus();
    fetchValidation();
    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/migrate?action=status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch migration status:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchValidation = async () => {
    try {
      const res = await fetch('/api/admin/migrate?action=validate');
      if (res.ok) {
        const data = await res.json();
        setValidation(data);
      }
    } catch (err) {
      console.error('Failed to fetch validation:', err);
    }
  };

  const handleRunMigration = async () => {
    if (!confirm(`Run migration (dry-run: ${dryRun})? This will modify your database.`))
      return;

    setRunning(true);
    try {
      const res = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run', dryRun }),
      });

      if (res.ok) {
        const result = await res.json();
        setShowResults(true);
        setTimeout(() => {
          fetchStatus();
          fetchValidation();
        }, 1000);
      } else {
        const error = await res.json();
        alert(`Migration failed: ${error.error || error.message}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setRunning(false);
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    try {
      await fetchValidation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#071422] tracking-tight mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Data Migration Tool
        </h1>
        <p className="text-[#3a5570] text-sm">
          Migrate admin data from old structure to new Firestore schema
        </p>
      </div>

      {/* Current Status */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
        <h2 className="text-lg font-bold text-[#071422] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Status
        </h2>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-[#f3f4f5] rounded w-1/3" />
            <div className="h-4 bg-[#f3f4f5] rounded w-1/2" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg">
              <div className="text-sm text-[#3a5570]">Migration Status</div>
              <div className="flex items-center gap-2">
                {status?.migrationInProgress ? (
                  <>
                    <Clock size={16} className="text-[#F59E0B] animate-spin" />
                    <span className="text-sm font-semibold text-[#F59E0B]">In Progress</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="text-[#10B981]" />
                    <span className="text-sm font-semibold text-[#10B981]">Idle</span>
                  </>
                )}
              </div>
            </div>

            {status?.lastMigration && (
              <>
                <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg">
                  <div className="text-sm text-[#3a5570]">Last Migration</div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#071422]">
                      {new Date(status.lastMigration.completedAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-[#3a5570]/60">
                      {status.lastMigration.dryRun ? 'Dry Run' : 'Applied'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg">
                  <div className="text-sm text-[#3a5570]">Records Migrated</div>
                  <div className="text-sm font-semibold text-[#071422]">
                    {status.lastMigration.results.reduce(
                      (sum: number, r: any) => sum + r.recordsMigrated,
                      0
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Validation Status */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#071422]" style={{ fontFamily: 'var(--font-display)' }}>
            Data Validation
          </h2>
          <button
            onClick={handleValidate}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#f3f4f5] rounded hover:bg-[#e7e8e9] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {validation ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg" style={{
              background: validation.valid ? '#ECFDF5' : '#FEF2F2',
            }}>
              {validation.valid ? (
                <>
                  <CheckCircle2 size={20} className="text-[#10B981]" />
                  <div>
                    <div className="font-semibold text-sm text-[#065F46]">All checks passed</div>
                    <div className="text-xs text-[#047857]">Data structure is valid and ready</div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="text-[#DC2626]" />
                  <div>
                    <div className="font-semibold text-sm text-[#7F1D1D]">
                      {validation.totalIssues} issue{validation.totalIssues !== 1 ? 's' : ''} found
                    </div>
                    <div className="text-xs text-[#991B1B]">Please review and fix issues before migrating</div>
                  </div>
                </>
              )}
            </div>

            {!validation.valid && validation.issues.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-xs font-semibold text-red-900 mb-3">Issues Found:</p>
                <ul className="space-y-1">
                  {validation.issues.slice(0, 5).map((issue, i) => (
                    <li key={i} className="text-xs text-red-800 flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                  {validation.issues.length > 5 && (
                    <li className="text-xs text-red-800 font-semibold">
                      ... and {validation.issues.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-[#3a5570]">Loading validation...</div>
        )}
      </div>

      {/* Migration Control */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
        <h2 className="text-lg font-bold text-[#071422] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Run Migration
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-[#FEF3C7] border border-[#FCD34D] rounded-lg">
            <p className="text-sm text-[#92400E]">
              <strong>⚠️ Warning:</strong> This will modify your Firestore database. Ensure you have a backup.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-[#e7e8e9] rounded-lg cursor-pointer hover:bg-[#f8f9fa]">
              <input
                type="radio"
                checked={dryRun}
                onChange={() => setDryRun(true)}
                disabled={running}
                className="w-4 h-4"
              />
              <div>
                <div className="font-semibold text-sm text-[#071422]">Dry Run (Recommended)</div>
                <div className="text-xs text-[#3a5570]">Preview changes without modifying data</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-[#e7e8e9] rounded-lg cursor-pointer hover:bg-[#f8f9fa]">
              <input
                type="radio"
                checked={!dryRun}
                onChange={() => setDryRun(false)}
                disabled={running}
                className="w-4 h-4"
              />
              <div>
                <div className="font-semibold text-sm text-[#071422]">Apply Migration</div>
                <div className="text-xs text-[#3a5570]">Permanently modify database (be careful!)</div>
              </div>
            </label>
          </div>

          <button
            onClick={handleRunMigration}
            disabled={running || status?.migrationInProgress}
            className="w-full px-4 py-3 bg-[#031632] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#041f3d] transition-colors flex items-center justify-center gap-2"
          >
            {running ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Running...
              </>
            ) : (
              <>
                <Database size={16} /> Run Migration
              </>
            )}
          </button>
        </div>
      </div>

      {/* Migration Results */}
      {showResults && status?.lastMigration && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <h2 className="text-lg font-bold text-[#071422] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Migration Results
          </h2>

          {status.lastMigration.results.map((result: any, i: number) => (
            <div key={i} className="mb-4 p-4 border border-[#e7e8e9] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm text-[#071422]">{result.migratedCollections[0]}</div>
                {result.success ? (
                  <CheckCircle2 size={16} className="text-[#10B981]" />
                ) : (
                  <AlertCircle size={16} className="text-[#DC2626]" />
                )}
              </div>
              <div className="space-y-1 text-xs text-[#3a5570]">
                <div>Processed: {result.recordsProcessed}</div>
                <div>Migrated: {result.recordsMigrated}</div>
                {result.errors.length > 0 && (
                  <div className="text-red-600">Errors: {result.errors.length}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schema Documentation */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
        <h2 className="text-lg font-bold text-[#071422] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          What Gets Migrated
        </h2>
        <div className="space-y-3">
          <div className="p-4 border border-[#e7e8e9] rounded-lg">
            <div className="font-semibold text-sm text-[#071422] mb-2">Users Collection</div>
            <ul className="space-y-1 text-xs text-[#3a5570]">
              <li>• Adds commissionRate (default: 5% for agents, 3% for brokers)</li>
              <li>• Calculates dealsCount from deals collection</li>
              <li>• Computes totalCommission (rate × deals × avg. value)</li>
            </ul>
          </div>

          <div className="p-4 border border-[#e7e8e9] rounded-lg">
            <div className="font-semibold text-sm text-[#071422] mb-2">Deals Collection</div>
            <ul className="space-y-1 text-xs text-[#3a5570]">
              <li>• Normalizes stage values to new pipeline stages</li>
              <li>• Maps old stage values to: new, engaged, viewing, negotiation, closed</li>
              <li>• Ensures agentId is present (uses assignedAgent as fallback)</li>
              <li>• Standardizes timestamp fields</li>
            </ul>
          </div>

          <div className="p-4 border border-[#e7e8e9] rounded-lg">
            <div className="font-semibold text-sm text-[#071422] mb-2">Listings Collection</div>
            <ul className="space-y-1 text-xs text-[#3a5570]">
              <li>• Normalizes status to: available, sold, rented</li>
              <li>• Ensures numeric fields (price, area) are numbers</li>
              <li>• Validates property types</li>
              <li>• Standardizes timestamp fields</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
