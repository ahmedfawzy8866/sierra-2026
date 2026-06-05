// SearchBar.jsx — Compound search input + filter chips

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = React.useState('San Francisco, CA');
  const [price, setPrice] = React.useState('');
  const [beds, setBeds] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('For Sale');

  const filters = ['For Sale', 'For Rent', 'New Listing', 'Open House'];

  const barStyle = {
    display: 'flex', alignItems: 'stretch',
    background: 'rgba(28,28,34,0.92)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(242,237,228,0.14)',
    borderRadius: '2px', overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
    maxWidth: '680px', width: '100%',
  };

  const segStyle = {
    flex: 1, padding: '14px 20px',
    borderRight: '1px solid rgba(242,237,228,0.08)',
    cursor: 'text',
  };

  const segLabelStyle = {
    fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: '#6B6870', marginBottom: '3px',
  };

  const segInputStyle = {
    fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 300,
    color: '#F2EDE4', background: 'transparent', border: 'none',
    outline: 'none', width: '100%', padding: 0,
  };

  const btnStyle = {
    background: '#C4963A', color: '#0C0C0F',
    padding: '0 28px', border: 'none', cursor: 'pointer',
    fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    transition: 'background 300ms ease', flexShrink: 0,
  };

  const chipStyle = (label) => ({
    padding: '6px 16px',
    border: `1px solid ${activeFilter === label ? '#C4963A' : 'rgba(242,237,228,0.14)'}`,
    borderRadius: '9999px', fontSize: '11px', fontWeight: 400,
    color: activeFilter === label ? '#C4963A' : '#A8A5B0',
    background: activeFilter === label ? 'rgba(196,150,58,0.12)' : 'transparent',
    cursor: 'pointer', transition: 'all 200ms ease',
    fontFamily: 'Jost, sans-serif',
  });

  return (
    <div>
      <div style={barStyle}>
        <div style={segStyle}>
          <div style={segLabelStyle}>Location</div>
          <input style={segInputStyle} value={location} onChange={e => setLocation(e.target.value)} placeholder="City, neighborhood or ZIP" />
        </div>
        <div style={segStyle}>
          <div style={segLabelStyle}>Price range</div>
          <input style={segInputStyle} value={price} onChange={e => setPrice(e.target.value)} placeholder="Any price" />
        </div>
        <div style={{ ...segStyle, borderRight: 'none' }}>
          <div style={segLabelStyle}>Bedrooms</div>
          <input style={segInputStyle} value={beds} onChange={e => setBeds(e.target.value)} placeholder="Any" />
        </div>
        <button style={btnStyle} onMouseOver={e=>e.target.style.background='#E8C47A'} onMouseOut={e=>e.target.style.background='#C4963A'} onClick={onSearch}>
          Search
        </button>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} style={chipStyle(f)} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { SearchBar });
