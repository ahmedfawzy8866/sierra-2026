// PropertyDetail.jsx — Full property detail view

const PropertyDetail = ({ property, onBack }) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [contactOpen, setContactOpen] = React.useState(false);

  if (!property) return null;

  const { title, location, price, beds, baths, sqft, badge, gradient } = property;

  const tabs = ['Overview', 'Gallery', 'Map', 'Agent'];

  const wrapStyle = {
    background: '#0C0C0F', minHeight: '100vh', paddingTop: '68px',
  };

  const heroStyle = {
    width: '100%', height: '65vh', position: 'relative',
    background: gradient || '#1C1C22',
    display: 'flex', alignItems: 'flex-end',
  };

  const heroPillsStyle = {
    position: 'absolute', top: '32px', left: '48px',
    display: 'flex', gap: '10px',
  };

  const heroBottomStyle = {
    padding: '0 80px 48px', width: '100%',
    background: 'linear-gradient(transparent, rgba(12,12,15,0.9))',
  };

  const tabStyle = (t) => ({
    fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500,
    letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
    padding: '16px 0', borderBottom: activeTab === t.toLowerCase()
      ? '1px solid #C4963A' : '1px solid transparent',
    color: activeTab === t.toLowerCase() ? '#C4963A' : '#6B6870',
    transition: 'color 200ms ease, border-color 200ms ease',
  });

  const specStyle = {
    display: 'flex', gap: '40px', marginTop: '8px',
  };

  const specItem = (label, value) => (
    <div key={label}>
      <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B6870', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '18px', fontWeight: 300, color: '#F2EDE4' }}>{value}</div>
    </div>
  );

  return (
    <div style={wrapStyle}>
      {/* Back */}
      <div style={{
        position: 'fixed', top: '80px', left: '32px', zIndex: 50,
        cursor: 'pointer', color: '#A8A5B0',
        fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.1em',
        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px',
      }} onClick={onBack}>
        ← Back
      </div>

      {/* Hero */}
      <div style={heroStyle}>
        <div style={heroPillsStyle}>
          {badge && <span style={{ background: 'rgba(196,150,58,0.2)', color: '#E8C47A', border: '1px solid rgba(196,150,58,0.3)', padding: '4px 12px', borderRadius: '2px', fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', backdropFilter: 'blur(8px)' }}>{badge}</span>}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,12,15,0.1) 0%, rgba(12,12,15,0.8) 100%)' }}></div>
        <div style={{ ...heroBottomStyle, position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4963A', marginBottom: '8px' }}>{location}</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em', color: '#F2EDE4', marginBottom: '16px' }}>{title}</h1>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '28px', fontWeight: 300, color: '#F2EDE4' }}>{price}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(242,237,228,0.08)', padding: '0 80px', display: 'flex', gap: '40px' }}>
        {tabs.map(t => <div key={t} style={tabStyle(t)} onClick={() => setActiveTab(t.toLowerCase())}>{t}</div>)}
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '0', maxWidth: '1440px' }}>
        <div style={{ padding: '56px 80px' }}>
          <div style={specStyle}>
            {specItem('Bedrooms', beds)}
            {specItem('Bathrooms', baths)}
            {specItem('Square Feet', sqft)}
            {specItem('Year Built', '1927')}
          </div>
          <div style={{ width: '40px', height: '1px', background: '#C4963A', margin: '36px 0' }}></div>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '17px', fontWeight: 300, lineHeight: 1.7, color: '#A8A5B0', maxWidth: '560px' }}>
            A rare Pacific Heights residence positioned to capture the bay's shifting light from morning through dusk. Four generous bedrooms, a south-facing garden, and a kitchen that opens to both — this is a home built around how life is actually lived.
          </p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '17px', fontWeight: 300, lineHeight: 1.7, color: '#A8A5B0', maxWidth: '560px', marginTop: '20px' }}>
            Restored to its original 1927 character while accommodating every modern expectation. Radiant heat. Sonos throughout. A two-car garage with EV charging. The details are there. They simply don't announce themselves.
          </p>
        </div>

        {/* Sidebar */}
        <div style={{ padding: '56px 48px 56px 0', borderLeft: '1px solid rgba(242,237,228,0.06)' }}>
          <div style={{ background: '#1C1C22', border: '1px solid rgba(242,237,228,0.08)', borderRadius: '4px', padding: '28px' }}>
            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B6870', marginBottom: '16px' }}>Listed by</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2a2420, #3d3028)', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '19px', fontWeight: 400, color: '#F2EDE4' }}>Julia Brennan</div>
                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#6B6870', marginTop: '2px' }}>Senior Associate · Pacific Heights</div>
              </div>
            </div>
            <button onClick={() => setContactOpen(true)} style={{ width: '100%', background: '#C4963A', color: '#0C0C0F', border: 'none', padding: '14px', borderRadius: '2px', fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '10px' }}>Schedule a viewing</button>
            <button style={{ width: '100%', background: 'transparent', color: '#A8A5B0', border: '1px solid rgba(242,237,228,0.14)', padding: '13px', borderRadius: '2px', fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>Request brochure</button>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      {contactOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(12,12,15,0.8)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1C1C22', border: '1px solid rgba(242,237,228,0.12)', borderRadius: '4px', padding: '48px', width: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.55)' }}>
            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4963A', marginBottom: '12px' }}>Schedule a viewing</div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', fontWeight: 300, color: '#F2EDE4', marginBottom: '28px', lineHeight: 1.2 }}>{title}</div>
            {['Your name', 'Email address', 'Phone (optional)'].map(ph => (
              <input key={ph} placeholder={ph} style={{ display: 'block', width: '100%', background: '#2E2E38', border: '1px solid rgba(242,237,228,0.08)', color: '#F2EDE4', fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 300, padding: '12px 14px', borderRadius: '2px', marginBottom: '10px', outline: 'none' }} />
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button style={{ flex: 1, background: '#C4963A', color: '#0C0C0F', border: 'none', padding: '13px', borderRadius: '2px', fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Send request</button>
              <button onClick={() => setContactOpen(false)} style={{ background: 'transparent', color: '#6B6870', border: '1px solid rgba(242,237,228,0.1)', padding: '13px 20px', borderRadius: '2px', fontFamily: 'Jost, sans-serif', fontSize: '11px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { PropertyDetail });
