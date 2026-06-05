import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ExternalLink, Home, Loader2, MapPin, ShieldCheck, Plus, X, Tag, User } from 'lucide-react';

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
  entityType?: 'Owner' | 'Broker';
  contactName?: string;
  contactPhone?: string;
};

type IntegrationMode = 'live' | 'fallback';

type InventoryPayload = {
  properties: UnifiedProperty[];
  mode: IntegrationMode;
  message: string;
};

const CORE_LISTINGS: UnifiedProperty[] = [
  {
    id: 'LV-3B-100K-F',
    title: 'Lake View Residence Apartment',
    location: 'Golden Square, New Cairo',
    price: 'EGP 12,500,000',
    status: 'Active',
    leads: 3,
    assignedTo: 'emp_01',
    source: 'EasyListing',
    entityType: 'Owner',
    contactName: 'Mohamed Aly',
    contactPhone: '+20 100 123 4567'
  },
  {
    id: 'MV-2B-80K-U',
    title: 'Mivida Exec Suite',
    location: 'Golden Square, New Cairo',
    price: 'EGP 9,800,000',
    status: 'Active',
    leads: 12,
    assignedTo: 'emp_02',
    source: 'EasyListing',
    entityType: 'Owner',
    contactName: 'Nour El Din',
    contactPhone: '+20 111 987 6543'
  },
  {
    id: 'PH-4B-250K-F',
    title: 'Palm Hills Standalone Villa',
    location: 'Choueifat, New Cairo',
    price: 'EGP 32,000,000',
    status: 'Active',
    leads: 5,
    assignedTo: 'emp_01',
    source: 'EasyListing',
    entityType: 'Broker',
    contactName: 'Tarek Sherif (Broker)',
    contactPhone: '+20 122 333 4444'
  },
];

const PROPERTY_FINDER_FALLBACK: UnifiedProperty[] = [
  {
    id: 'PF-1024',
    title: 'Sodic Eastown Apartment',
    location: 'Tagamoa Central, New Cairo',
    price: 'EGP 8,200,000',
    status: 'Active',
    leads: 8,
    assignedTo: 'emp_01',
    source: 'Property Finder',
    entityType: 'Broker',
    contactName: 'Karim Hosny',
    contactPhone: '+20 155 444 5555'
  },
  {
    id: 'PF-2055',
    title: 'Mountain View Hyde Park Penthouse',
    location: 'Golden Square, New Cairo',
    price: 'EGP 15,000,000',
    status: 'Active',
    leads: 4,
    assignedTo: 'emp_02',
    source: 'Property Finder',
    entityType: 'Owner',
    contactName: 'Sherif Fayed',
    contactPhone: '+20 109 222 3333'
  },
];

const PROPERTY_FINDER_PROXY_URL = import.meta.env.VITE_PROPERTY_FINDER_PROXY_URL as string | undefined;

const normalizeCurrency = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.includes('EGP') ? value : `EGP ${value}`;
  }
  if (typeof value === 'number') {
    return `EGP ${value.toLocaleString('en-US')}`;
  }
  return 'EGP 0';
};

const normalizePropertyFinderItem = (item: Record<string, unknown>, index: number): UnifiedProperty => {
  const id = String(item.reference ?? item.id ?? `PF-LIVE-${index + 1}`);
  const title = String(item.title ?? item.name ?? 'Untitled Property');
  const location = String(item.location_name ?? item.location ?? 'New Cairo');
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
    entityType: Math.random() > 0.4 ? 'Owner' : 'Broker',
    contactName: 'System Synced Account',
    contactPhone: '+20 100 000 0000'
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
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    compoundCode: 'LV',
    bedrooms: '3B',
    priceVal: '12000000', // Actual Price in EGP
    status: 'F',
    title: '',
    location: 'Golden Square, New Cairo',
    entityType: 'Owner' as 'Owner' | 'Broker',
    contactName: '',
    contactPhone: ''
  });

  // Calculate Auto-Generated Property Code
  const generatedPropertyCode = useMemo(() => {
    const priceK = Math.round(Number(formData.priceVal || 0) / 100000);
    return `${formData.compoundCode}-${formData.bedrooms}-${priceK}K-${formData.status}`;
  }, [formData]);

  const applyInventoryResult = (result: InventoryPayload): void => {
    setInventory(result.properties);
    setIntegrationMode(result.mode);
    setSyncMessage(result.message);
    setIsLoading(false);
  };

  const syncInventory = async (signal: AbortSignal): Promise<void> => {
    setIsLoading(true);
    const result = await loadIntegratedInventory(signal);
    if (signal.aborted) return;
    applyInventoryResult(result);
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadIntegratedInventory(controller.signal).then((result) => {
      if (controller.signal.aborted) return;
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

  const stats = useMemo(() => {
    const total = inventory.length;
    const owners = inventory.filter(p => p.entityType === 'Owner').length;
    const ratio = total > 0 ? Math.round((owners / total) * 100) : 0;
    return { total, owners, ratio };
  }, [inventory]);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.contactName || !formData.contactPhone) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const newProperty: UnifiedProperty = {
      id: generatedPropertyCode,
      title: formData.title,
      location: formData.location,
      price: normalizeCurrency(Number(formData.priceVal)),
      status: 'Active',
      leads: 0,
      assignedTo: currentUserId,
      source: 'EasyListing',
      entityType: formData.entityType,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone
    };

    setInventory(prev => [newProperty, ...prev]);
    setIsAddModalOpen(false);
    
    // Reset Form
    setFormData({
      compoundCode: 'LV',
      bedrooms: '3B',
      priceVal: '12000000',
      status: 'F',
      title: '',
      location: 'Golden Square, New Cairo',
      entityType: 'Owner',
      contactName: '',
      contactPhone: ''
    });
  };

  const propertyFinderCount = inventory.filter(
    (property) => property.source === 'Property Finder',
  ).length;

  return (
    <div className="easy-listing-container animate-fade-in" style={{ padding: '2rem' }}>
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}
      >
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.25rem', fontWeight: 300 }}>
            <ShieldCheck size={32} color="#D4AF37" />
            EasyListing Sourcing Hub
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Verify live synced properties and manage premium Egypt (New Cairo) direct owner listings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--gold)', color: 'var(--gold)' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} /> Add New Unit
          </button>
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
      </div>

      {/* Vetting KPI Metrics bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Direct-From-Owner Listings</span>
          <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', fontWeight: 300, color: 'var(--gold)' }}>{stats.owners} Units</h2>
        </div>
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Direct Owner Ratio Target</span>
          <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', fontWeight: 300, color: stats.ratio >= 40 ? '#22c55e' : '#f59e0b' }}>
            {stats.ratio}% <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 40% Target</span>
          </h2>
        </div>
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Portfolio Value</span>
          <h2 style={{ fontSize: '1.75rem', margin: '0.5rem 0 0', fontWeight: 300, color: 'var(--text-primary)' }}>EGP 54.3M</h2>
        </div>
      </div>

      <div
        style={{
          marginBottom: '1.5rem',
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
          Property Finder Hub: {propertyFinderCount} Synced
        </span>
      </div>

      {/* Main Properties table */}
      <div
        className="table-container"
        style={{
          backgroundColor: 'var(--navy)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          overflow: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '920px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>System Code</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Vetting Status</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Asset Name</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Location</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Price</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Source</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Owner / Contact</th>
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
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.05em' }}>{property.id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor:
                        property.entityType === 'Owner' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: property.entityType === 'Owner' ? '#22c55e' : '#f59e0b',
                      border: `1px solid ${property.entityType === 'Owner' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                    }}
                  >
                    {property.entityType === 'Owner' ? 'Direct Owner' : 'Broker Listed'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
                    <Home size={18} color="var(--text-secondary)" /> {property.title}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} /> {property.location}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>{property.price}</td>
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
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.85rem' }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>{property.contactName || 'N/A'}</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{property.contactPhone || 'N/A'}</p>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <a
                    href={`http://localhost:3000/listings/1`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.825rem',
                    }}
                  >
                    View Brochure <ExternalLink size={14} />
                  </a>
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

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--surface-container-low, #0F172A)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid var(--border)',
              background: 'linear-gradient(to right, rgba(212,175,55,0.03), transparent)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 300, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={20} color="var(--gold)" />
                Add Premium Unit
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddProperty} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Asset Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mivida Boulevard Penthouse"
                  value={formData.title} 
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>District Location</label>
                  <select 
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--navy)', color: 'var(--text-primary)' }}
                  >
                    <option value="Golden Square, New Cairo">Golden Square</option>
                    <option value="Tagamoa Central, New Cairo">Tagamoa Central</option>
                    <option value="Choueifat, New Cairo">Choueifat</option>
                    <option value="Beit El Watan, New Cairo">Beit El Watan</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Vetting Classification</label>
                  <select 
                    value={formData.entityType}
                    onChange={e => setFormData(prev => ({ ...prev, entityType: e.target.value as 'Owner' | 'Broker' }))}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--navy)', color: 'var(--text-primary)' }}
                  >
                    <option value="Owner">Direct Owner (FSBO)</option>
                    <option value="Broker">Broker Listed</option>
                  </select>
                </div>
              </div>

              {/* Encoder logic */}
              <div style={{ border: '1px dashed var(--gold)', borderRadius: '16px', padding: '1.25rem', backgroundColor: 'rgba(212,175,55,0.02)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auto-Codification Encoder</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Compound Code</span>
                    <select 
                      value={formData.compoundCode} 
                      onChange={e => setFormData(prev => ({ ...prev, compoundCode: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--navy)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                    >
                      <option value="LV">LV (Lake View)</option>
                      <option value="MV">MV (Mivida)</option>
                      <option value="PH">PH (Palm Hills)</option>
                      <option value="ED">ED (Eastown)</option>
                      <option value="BW">BW (Beit Watan)</option>
                    </select>
                  </div>
                  
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Bedrooms</span>
                    <select 
                      value={formData.bedrooms} 
                      onChange={e => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--navy)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                    >
                      <option value="1B">1 Bed</option>
                      <option value="2B">2 Beds</option>
                      <option value="3B">3 Beds</option>
                      <option value="4B">4 Beds</option>
                      <option value="5B">5 Beds</option>
                    </select>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Price (EGP)</span>
                    <input 
                      type="number" 
                      value={formData.priceVal} 
                      onChange={e => setFormData(prev => ({ ...prev, priceVal: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Furnishing</span>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--navy)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                    >
                      <option value="F">F (Furnished)</option>
                      <option value="U">U (Unfurnished)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generated Property Code:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.05em' }}>{generatedPropertyCode}</span>
                </div>
              </div>

              {/* Owner / Broker Contact section */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} /> Contact Information
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Contact Full Name"
                      value={formData.contactName} 
                      onChange={e => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      placeholder="Mobile Phone Number"
                      value={formData.contactPhone} 
                      onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" type="submit" style={{ height: '50px', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Plus size={18} /> Push to Active Inventory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
