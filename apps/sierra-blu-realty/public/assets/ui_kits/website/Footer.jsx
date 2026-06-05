// Footer.jsx — Minimal dark footer

const Footer = ({ onNavigate }) => {
  const footerStyle = {
    background: '#1C1C22',
    borderTop: '1px solid rgba(242,237,228,0.06)',
    padding: '64px 80px 40px',
  };

  const cols = [
    { heading: 'Search', links: ['Buy', 'Rent', 'New Listings', 'Open Houses', 'Price Reduced'] },
    { heading: 'Company', links: ['About', 'Agents', 'Journal', 'Careers', 'Press'] },
    { heading: 'Support', links: ['Contact', 'FAQ', 'Privacy Policy', 'Terms of Use'] },
  ];

  return (
    <footer style={footerStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '64px', marginBottom: '64px' }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F2EDE4', marginBottom: '12px' }}>Meridian</div>
          <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4963A', marginBottom: '20px' }}>Properties</div>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 300, lineHeight: 1.7, color: '#6B6870', maxWidth: '280px' }}>
            San Francisco's most considered approach to buying, selling, and living well.
          </p>
        </div>
        {cols.map(col => (
          <div key={col.heading}>
            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A8A5B0', marginBottom: '20px' }}>{col.heading}</div>
            {col.links.map(link => (
              <div key={link} style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 300, color: '#6B6870', marginBottom: '10px', cursor: 'pointer', transition: 'color 200ms ease' }}
                onMouseOver={e => e.target.style.color = '#A8A5B0'}
                onMouseOut={e => e.target.style.color = '#6B6870'}
              >{link}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(242,237,228,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 300, color: '#3E3E4C' }}>© 2026 Meridian Properties. All rights reserved. DRE #01234567</div>
        <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 300, color: '#3E3E4C' }}>San Francisco · Marin · Peninsula</div>
      </div>
    </footer>
  );
};

Object.assign(window, { Footer });
