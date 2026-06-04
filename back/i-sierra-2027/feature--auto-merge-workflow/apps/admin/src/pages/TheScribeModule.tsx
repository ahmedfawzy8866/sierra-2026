import { useState } from 'react';
import { MessageSquare, Terminal, FileJson, CheckCircle, AlertCircle, Database, Sparkles } from 'lucide-react';

interface NormalizedListing {
  code: string;
  title: string;
  location: string;
  price: string;
  entityType: 'Owner' | 'Broker';
  contactName: string;
  contactPhone: string;
  rawText: string;
}

const MOCK_EXTRACTED_LISTINGS: NormalizedListing[] = [
  {
    code: 'LV-3B-125K-F',
    title: 'Lake View Residence Furnished Apartment',
    location: 'Golden Square, New Cairo',
    price: 'EGP 12,500,000',
    entityType: 'Owner',
    contactName: 'Mohamed Aly (Owner)',
    contactPhone: '+20 100 123 4567',
    rawText: 'شقة مفروشة للايجار او البيع في ليك فيو ريزيدنس التجمع الخامس. ٣ غرف نوم. تشطيب سوبر لوكس. للتواصل مع المالك مباشرة 01001234567. السعر ١٢.٥ مليون كاش.'
  },
  {
    code: 'MV-2B-98K-U',
    title: 'Mivida Compound Apartment',
    location: 'Golden Square, New Cairo',
    price: 'EGP 9,800,000',
    entityType: 'Owner',
    contactName: 'Nour El Din (Owner)',
    contactPhone: '+20 111 987 6543',
    rawText: 'عندي شقة في ميفيدا التجمع الخامس للبيع من المالك مباشرة بدون عمولات. غرفتين نوم وصالة كبيرة. فيو لاند سكيب. سعر نهائي 9 مليون و 800 الف كاش. ت: 01119876543'
  }
];

export const TheScribeModule = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawInputText, setRawInputText] = useState('');
  const [normalizedResult, setNormalizedResult] = useState<NormalizedListing | null>(null);
  const [ingestedListings, setIngestedListings] = useState<NormalizedListing[]>(MOCK_EXTRACTED_LISTINGS);

  const handleAIMessageParse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInputText.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI Extraction based on pasted WhatsApp raw text
    setTimeout(() => {
      const text = rawInputText.toLowerCase();
      let compound = 'LV';
      let locationName = 'Golden Square, New Cairo';
      let title = 'Sourced New Cairo Apartment';
      let bedrooms = '3B';
      let priceVal = 10000000; // default 10M
      let isOwner = 'Owner';
      let contactNum = '+20 100 000 0000';

      // Advanced parser simulation
      if (text.includes('ميفيدا') || text.includes('mivida')) {
        compound = 'MV';
        title = 'Mivida Premium Suite';
        locationName = 'Golden Square, New Cairo';
      } else if (text.includes('ليك فيو') || text.includes('lake view')) {
        compound = 'LV';
        title = 'Lake View Residence Apartment';
        locationName = 'Golden Square, New Cairo';
      } else if (text.includes('هايد بارك') || text.includes('hyde park')) {
        compound = 'HP';
        title = 'Hyde Park Compound Luxury Unit';
        locationName = 'Tagamoa Central, New Cairo';
      } else if (text.includes('الشروق') || text.includes('shorouk')) {
        compound = 'SH';
        title = 'Shorouk Compound Villa';
        locationName = 'Shorouk, New Cairo';
      }

      if (text.includes('غرفتين') || text.includes('2') || text.includes('غرف ٢')) {
        bedrooms = '2B';
      } else if (text.includes('غرفة') || text.includes('1')) {
        bedrooms = '1B';
      } else if (text.includes('٤ غرف') || text.includes('4')) {
        bedrooms = '4B';
      }

      // Check price EGP
      const priceMatch = text.match(/(\d+(\.\d+)?)\s*(مليون|million|m)/);
      if (priceMatch) {
        const num = parseFloat(priceMatch[1]);
        priceVal = num * 1000000;
      }

      // Check if Owner or Broker
      if (text.includes('المالك') || text.includes('مالك') || text.includes('owner') || text.includes('من المالك')) {
        isOwner = 'Owner';
      } else {
        isOwner = 'Broker';
      }

      // Check phone number
      const phoneMatch = text.match(/(01\d{9})/);
      if (phoneMatch) {
        contactNum = `+20 ${phoneMatch[1].slice(0, 3)} ${phoneMatch[1].slice(3, 6)} ${phoneMatch[1].slice(6)}`;
      }

      const priceK = Math.round(priceVal / 100000);
      const generatedCode = `${compound}-${bedrooms}-${priceK}K-${text.includes('مفروش') ? 'F' : 'U'}`;

      const parsed: NormalizedListing = {
        code: generatedCode,
        title,
        location: locationName,
        price: `EGP ${priceVal.toLocaleString()}`,
        entityType: isOwner as 'Owner' | 'Broker',
        contactName: isOwner === 'Owner' ? 'Direct Owner' : 'External Broker',
        contactPhone: contactNum,
        rawText: rawInputText
      };

      setNormalizedResult(parsed);
      setIsProcessing(false);
    }, 1500);
  };

  const handlePushToInventory = () => {
    if (!normalizedResult) return;
    setIngestedListings(prev => [normalizedResult, ...prev]);
    setRawInputText('');
    setNormalizedResult(null);
    alert('Listing successfully verified & added to Active Inventory database!');
  };

  return (
    <div className="scribe-container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.25rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            <MessageSquare size={32} color="#D4AF37" />
            The Scribe: WhatsApp Aggregator
            <span style={{ fontSize: '0.75rem', verticalAlign: 'middle', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>S1–S2</span>
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Paste raw property lists from Egypt real estate WhatsApp groups and auto-generate clean structured listings.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Paste Raw Message Intake */}
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} color="var(--gold)" /> WhatsApp Raw Message Intake
            </h3>
          </div>
          
          <form onSubmit={handleAIMessageParse} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Copy and paste any raw text listing (Arabic or English) from WhatsApp groups, including prices, contact numbers, and features.
            </p>
            <textarea
              value={rawInputText}
              onChange={e => setRawInputText(e.target.value)}
              placeholder="e.g. شقة للايجار في التجمع الخامس بكومبوند ميفيدا. من المالك مباشرة بدون وسيط. ٣ غرف وصالة. سعر الإيجار ٢٥ الف شهريا. ت: 01002345678"
              rows={8}
              style={{
                width: '100%',
                padding: '1.25rem',
                backgroundColor: 'rgba(0,0,0,0.35)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'none'
              }}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={isProcessing} style={{ height: '50px', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Normalizing with AI Scribe...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Ingest &amp; Normalize Listing
                </>
              )}
            </button>
          </form>
        </div>

        {/* Normalization & Vetting Results */}
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileJson size={18} color="var(--gold)" /> Neural SBR Normalization Results
            </h3>
          </div>

          <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!normalizedResult ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
                <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.15 }} />
                <p>Paste a WhatsApp listing and click Ingest to see AI extraction.</p>
              </div>
            ) : (
              <>
                <div style={{ position: 'relative' }}>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Extracted Schema Properties</h4>
                  <pre style={{
                    margin: 0,
                    padding: '1.5rem',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    color: '#38bdf8',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    overflowX: 'auto'
                  }}>
{`{
  "stage": "S2-Extraction",
  "autogenerated_code": "${normalizedResult.code}",
  "extracted": {
    "title": "${normalizedResult.title}",
    "location": "${normalizedResult.location}",
    "price": "${normalizedResult.price}",
    "vetting": {
      "classification": "${normalizedResult.entityType}",
      "owner_priority": ${normalizedResult.entityType === 'Owner' ? 'true' : 'false'}
    },
    "contacts": {
      "name": "${normalizedResult.contactName}",
      "phone": "${normalizedResult.contactPhone}"
    }
  }
}`}
                  </pre>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <CheckCircle size={20} color="#22c55e" />
                    <span style={{ fontSize: '0.85rem', color: '#22c55e' }}>Vetted successfully as {normalizedResult.entityType === 'Owner' ? 'Direct Owner (EGP 0 Broker Commission)' : 'Co-Broker Listing'}.</span>
                  </div>
                  <button onClick={handlePushToInventory} className="btn btn-primary" style={{ width: '100%', height: '54px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <Database size={18} /> Push to Global Inventory
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recents Aggregated bar */}
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Recently Aggregated WhatsApp Listings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {ingestedListings.map((listing, index) => (
            <div key={index} style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1.5fr 3fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>{listing.code}</span>
                <h4 style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 400 }}>{listing.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{listing.location}</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>"{listing.rawText}"</p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span className="status-badge" style={{ alignSelf: 'flex-end', backgroundColor: listing.entityType === 'Owner' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245,158,11,0.1)', color: listing.entityType === 'Owner' ? '#22c55e' : '#f59e0b' }}>
                  {listing.entityType === 'Owner' ? 'Direct Owner' : 'Broker Co-Broke'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{listing.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default TheScribeModule;
