// PropertyCard.jsx — Listing card with hover states, badge, specs

const PropertyCard = ({ property, onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  const { title, location, price, beds, baths, sqft, badge, gradient } = property;

  const cardStyle = {
    background: '#1C1C22',
    border: '1px solid rgba(242,237,228,0.08)',
    borderRadius: '4px', overflow: 'hidden',
    cursor: 'pointer',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.40)' : '0 2px 8px rgba(0,0,0,0.25)',
    transition: 'transform 300ms ease, box-shadow 300ms ease',
  };

  const imgStyle = {
    width: '100%', height: '200px', overflow: 'hidden',
    background: gradient || 'linear-gradient(135deg, #2a2420 0%, #3d3028 50%, #1e1a18 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  };

  const imgInnerStyle = {
    width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
    background: gradient || 'linear-gradient(135deg, #2a2420 0%, #3d3028 50%, #1e1a18 100%)',
    transform: hovered ? 'scale(1.04)' : 'scale(1)',
    transition: 'transform 500ms ease',
  };

  return (
    <div style={cardStyle} onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      <div style={imgStyle}>
        <div style={imgInnerStyle}></div>
        {badge && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(196,150,58,0.15)', color: '#E8C47A',
            border: '1px solid rgba(196,150,58,0.3)',
            padding: '3px 10px', borderRadius: '2px',
            fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
          }}>{badge}</div>
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
          background: 'linear-gradient(transparent, rgba(12,12,15,0.7))',
        }}></div>
      </div>

      <div style={{ padding: '16px 18px 20px' }}>
        {location && (
          <div style={{
            fontFamily: 'Jost, sans-serif', fontSize: '9px', fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#C4963A', marginBottom: '5px',
          }}>{location}</div>
        )}
        <div style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '20px', fontWeight: 400, lineHeight: 1.2,
          color: '#F2EDE4', marginBottom: '8px',
        }}>{title}</div>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: '15px', fontWeight: 300,
          color: '#F2EDE4', marginBottom: '10px',
        }}>{price}</div>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: '11px',
          color: '#6B6870',
        }}>{beds} bed · {baths} bath · {sqft} sq ft</div>
      </div>
    </div>
  );
};

Object.assign(window, { PropertyCard });
