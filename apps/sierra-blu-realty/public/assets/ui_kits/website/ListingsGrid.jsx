// ListingsGrid.jsx — Property listings grid with heading

const LISTINGS = [
  {
    id: 1, title: 'Maple Street Residence', location: 'Pacific Heights',
    price: '$4,250,000', beds: 4, baths: 3, sqft: '2,840',
    gradient: 'linear-gradient(135deg, #2a2218 0%, #3d3020 60%, #1e1810 100%)',
  },
  {
    id: 2, title: 'Vallejo Street Penthouse', location: 'Russian Hill',
    price: '$7,100,000', beds: 3, baths: 3, sqft: '3,200', badge: 'New listing',
    gradient: 'linear-gradient(135deg, #18222a 0%, #20303d 60%, #101820 100%)',
  },
  {
    id: 3, title: 'Church Street Victorian', location: 'Noe Valley',
    price: '$3,600,000', beds: 5, baths: 4, sqft: '3,510',
    gradient: 'linear-gradient(135deg, #221a20 0%, #362230 60%, #1a1018 100%)',
  },
  {
    id: 4, title: 'Broadway Terrace Estate', location: 'Pacific Heights',
    price: '$9,800,000', beds: 6, baths: 5, sqft: '5,200', badge: 'Price reduced',
    gradient: 'linear-gradient(135deg, #1e2218 0%, #2a3020 60%, #141a10 100%)',
  },
  {
    id: 5, title: 'Clay Street Garden Home', location: 'Presidio Heights',
    price: '$5,400,000', beds: 4, baths: 4, sqft: '3,780',
    gradient: 'linear-gradient(135deg, #22201a 0%, #302e22 60%, #1a1810 100%)',
  },
  {
    id: 6, title: 'Divisadero Loft', location: 'Lower Pacific Heights',
    price: '$2,150,000', beds: 2, baths: 2, sqft: '1,640', badge: 'Open house',
    gradient: 'linear-gradient(135deg, #1a1822 0%, #282430 60%, #10101a 100%)',
  },
];

const ListingsGrid = ({ onSelectProperty }) => {
  const sectionStyle = {
    background: '#0C0C0F', padding: '96px 80px',
  };

  const headerStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    marginBottom: '56px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  };

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <div>
          <div style={{
            fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#C4963A', marginBottom: '12px',
          }}>Featured Properties</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300,
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#F2EDE4',
          }}>Homes worth knowing.</h2>
        </div>
        <button onClick={() => onSelectProperty(null)} style={{
          background: 'transparent', border: '1px solid rgba(242,237,228,0.2)',
          color: '#A8A5B0', padding: '10px 24px', borderRadius: '2px',
          fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
        }}>View all listings</button>
      </div>

      <div style={gridStyle}>
        {LISTINGS.map(p => (
          <PropertyCard key={p.id} property={p} onClick={() => onSelectProperty(p)} />
        ))}
      </div>
    </section>
  );
};

Object.assign(window, { ListingsGrid, LISTINGS });
