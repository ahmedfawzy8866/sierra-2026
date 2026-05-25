import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ExternalLink, Home, Loader2, MapPin, ShieldCheck } from 'lucide-react';

type ListingSource = 'EasyListing' | 'Property Finder';

type UnifiedProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  status: 'Active' | 'Pending' | 'Draft';
  leads: number;
  assignedTo: string;
  source: ListingSource;
};

type IntegrationMode = 'live' | 'fallback';

type InventoryPayload = {
  properties: UnifiedProperty[];
  mode: IntegrationMode;
  message: string;
};

const CORE_LISTINGS: UnifiedProperty[] = [
  {
    id: 'EL-849',
    title: 'Skyline Penthouse',
    location: 'Downtown Boulevard',
    price: '$4,200,000',
    status: 'Active',
    leads: 3,
    assignedTo: 'emp_01',
    source: 'EasyListing',
  },
  {
    id: 'EL-902',
    title: 'Marina Waterfront Villa',
    location: 'Marina Harbor',
    price: '$8,500,000',
    status: 'Pending',
    leads: 12,
    assignedTo: 'emp_02',
    source: 'EasyListing',
  },
  {
    id: 'EL-114',
    title: 'Luxury Golf Estate',
    location: 'Emerald Hills',
    price: '$6,100,000',
    status: 'Active',
    leads: 5,
    assignedTo: 'emp_01',
    source: 'EasyListing',
  },
];

const PROPERTY_FINDER_FALLBACK: UnifiedProperty[] = [
  {
    id: 'PF-1024',
    title: 'Paramount Residences',
    location: 'Business Bay',
    price: '$2,100,000',
    status: 'Active',
    leads: 8,
    assignedTo: 'emp_01',
    source: 'Property Finder',
  },
  {
    id: 'PF-2055',
    title: 'Palm Jumeirah Signature Villa',
    location: 'Palm Jumeirah',
    price: '$12,000,000',
    status: 'Active',
    leads: 4,
    assignedTo: 'emp_02',
    source: 'Property Finder',
  },
];

const PROPERTY_FINDER_PROXY_URL = import.meta.env.VITE_PROPERTY_FINDER_PROXY_URL as string | undefined;

const normalizeCurrency = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (typeof value === 'number') {
    return `$${value.toLocaleString('en-US')}`;
  }
  return '$0';
};

const normalizePropertyFinderItem = (item: Record<string, unknown>, index: number): UnifiedProperty => {
  const id = String(item.reference ?? item.id ?? `PF-LIVE-${index + 1}`);
  const title = String(item.title ?? item.name ?? 'Untitled Property');
  const location = String(item.location_name ?? item.location ?? 'Unknown Location');
  const price = normalizeCurrency(item.price ?? item.price_value);
  const statusValue = String(item.status ?? 'Active').toLowerCase();
  const status: UnifiedProperty['status'] =
    statusValue === 'pending' ? 'Pending' : statusValue === 'draft' ? 'Draft' : 'Active';
  const leads = Number.isFinite(item.leads) ? Number(item.leads) : 0;

  return {
    id,
    title,
    location,
    price,
    status,
    leads,
    assignedTo: String(item.assignedTo ?? item.assigned_to ?? 'emp_01'),
    source: 'Property Finder',
  };
};

const loadIntegratedInventory = async (signal: AbortSignal): Promise<InventoryPayload> => {
  if (!PROPERTY_FINDER_PROXY_URL) {
    return {
      properties: [...CORE_LISTINGS, ...PROPERTY_FINDER_FALLBACK],
      mode: 'fallback',
      message: 'Property Finder proxy is not configured. Showing safe fallback data.',
    };
  }

  try {
    const response = await fetch(PROPERTY_FINDER_PROXY_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Property Finder sync failed with status ${response.status}`);
    }

    const payload = (await response.json()) as
      | Record<string, unknown>
      | Array<Record<string, unknown>>;

    const rawItems = Array.isArray(payload)
      ? payload
      : (payload.results as Array<Record<string, unknown>> | undefined) ??
        (payload.properties as Array<Record<string, unknown>> | undefined) ??
        [];

    const propertyFinderListings = rawItems.map((item, index) =>
      normalizePropertyFinderItem(item, index),
    );

    return {
      properties: [...CORE_LISTINGS, ...propertyFinderListings],
      mode: 'live',
      message: `Property Finder connected: ${propertyFinderListings.length} live listings loaded.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      properties: [...CORE_LISTINGS, ...PROPERTY_FINDER_FALLBACK],
      mode: 'fallback',
      message: `Live sync unavailable (${message}). Showing fallback inventory.`,
    };
  }
};

type EasyListingModuleProps = {
  currentUserRole: string;
  currentUserId: string;
};

export const EasyListingModule = ({ currentUserRole, currentUserId }: EasyListingModuleProps) => {
  const [inventory, setInventory] = useState<UnifiedProperty[]>([]);
  const [integrationMode, setIntegrationMode] = useState<IntegrationMode>('fallback');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncMessage, setSyncMessage] = useState<string>('Initializing inventory sync...');

  const applyInventoryResult = (result: InventoryPayload): void => {
    setInventory(result.properties);
    setIntegrationMode(result.mode);
    setSyncMessage(result.message);
    setIsLoading(false);
  };

  const syncInventory = async (signal: AbortSignal): Promise<void> => {
    setIsLoading(true);

    const result = await loadIntegratedInventory(signal);
    if (signal.aborted) {
      return;
    }

    applyInventoryResult(result);
  };

  useEffect(() => {
    const controller = new AbortController();

    void loadIntegratedInventory(controller.signal).then((result) => {
      if (controller.signal.aborted) {
        return;
      }
      applyInventoryResult(result);
    });

    return () => {
      controller.abort();
    };
  }, []);

  const filteredProperties = useMemo(() => {
    return currentUserRole === 'super_admin'
      ? inventory
      : inventory.filter((property) => property.assignedTo === currentUserId);
  }, [currentUserId, currentUserRole, inventory]);

  const propertyFinderCount = inventory.filter(
    (property) => property.source === 'Property Finder',
  ).length;

  return (
    <div className="easy-listing-container animate-fade-in">
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={28} color="#D4AF37" />
            Property Finder Integration Hub
          </h1>
          <p className="page-subtitle">
            Unified listing skeleton with live Property Finder sync and EasyListing fallback.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            const controller = new AbortController();
            void syncInventory(controller.signal);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Syncing...
            </>
          ) : (
            'Sync Property Finder'
          )}
        </button>
      </div>

      <div
        style={{
          marginBottom: '1rem',
          backgroundColor: 'var(--navy)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          {integrationMode === 'live' ? <ShieldCheck size={16} color="#22c55e" /> : <AlertCircle size={16} color="#f59e0b" />}
          <span>{syncMessage}</span>
        </div>
        <span className="status-badge" style={{ backgroundColor: 'rgba(201, 168, 76, 0.12)', color: 'var(--gold)' }}>
          Property Finder Listings: {propertyFinderCount}
        </span>
      </div>

      <div
        className="table-container"
        style={{
          backgroundColor: 'var(--navy)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '920px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Property Code</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Source</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Asset Name</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Location</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Price</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Leads</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr
                key={property.id}
                style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s ease' }}
                className="table-row-hover"
              >
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--gold)' }}>{property.id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor:
                        property.source === 'EasyListing' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: property.source === 'EasyListing' ? '#38bdf8' : '#ef4444',
                    }}
                  >
                    {property.source}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Home size={18} color="var(--text-secondary)" /> {property.title}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} /> {property.location}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>{property.price}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span className="status-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                    {property.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor:
                        property.leads > 5 ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: property.leads > 5 ? 'var(--gold)' : 'var(--text-primary)',
                    }}
                  >
                    {property.leads} Leads
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <button
                    className="btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    Open Lead Pipeline <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && filteredProperties.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No properties are currently assigned to this account.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 size={16} className="animate-spin" />
                    Synchronizing inventory...
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
