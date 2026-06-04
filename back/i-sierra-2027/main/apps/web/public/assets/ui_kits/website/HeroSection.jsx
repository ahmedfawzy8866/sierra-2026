// HeroSection.jsx — Full-bleed cinematic hero with headline + search

const HeroSection = ({ onSearch }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const heroStyle = {
    position: 'relative', width: '100%', height: '100vh', minHeight: '700px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', overflow: 'hidden',
    background: 'linear-gradient(160deg, #1a1410 0%, #0f0d0a 35%, #0C0C0F 70%, #12101a 100%)',
  };

  const gradientOverlay = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(12,12,15,0.3) 0%, rgba(12,12,15,0.1) 40%, rgba(12,12,15,0.7) 100%)',
    pointerEvents: 'none',
  };

  // Decorative architectural lines
  const lineStyle = (opacity, top, left, width, rotate) => ({
    position: 'absolute', top, left, width, height: '1px',
    background: `rgba(196,150,58,${opacity})`,
    transform: `rotate(${rotate}deg)`, pointerEvents: 'none',
  });

  const contentStyle = {
    position: 'relative', zIndex: 2, textAlign: 'center',
    padding: '0 24px', maxWidth: '900px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 900ms cubic-bezier(0.25,0,0,1), transform 900ms cubic-bezier(0.25,0,0,1)',
  };

  const overlineStyle = {
    fontFamily: 'Jost, sans-serif', fontSize: '10px', fontWeight: 500,
    letterSpacing: '0.28em', textTransform: 'uppercase',
    color: '#C4963A', marginBottom: '28px',
    opacity: visible ? 1 : 0,
    transition: 'opacity 900ms 200ms ease',
  };

  const headlineStyle = {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    fontSize: 'clamp(52px, 7vw, 112px)', fontWeight: 300,
    lineHeight: 1, letterSpacing: '-0.03em',
    color: '#F2EDE4', marginBottom: '32px',
  };

  const subStyle = {
    fontFamily: 'Jost, sans-serif', fontSize: '16px', fontWeight: 300,
    lineHeight: 1.65, color: '#A8A5B0',
    maxWidth: '480px', margin: '0 auto 48px',
  };

  const scrollHintStyle = {
    position: 'absolute', bottom: '36px', left: '50%',
    transform: 'translateX(-50%)', zIndex: 2,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    opacity: 0.5,
  };

  return (
    <section style={heroStyle}>
      {/* Decorative gold lines */}
      <div style={lineStyle(0.12, '20%', '5%', '25%', -15)}></div>
      <div style={lineStyle(0.06, '60%', '80%', '18%', 20)}></div>
      <div style={lineStyle(0.08, '75%', '10%', '12%', 5)}></div>
      <div style={gradientOverlay}></div>

      <div style={contentStyle}>
        <div style={overlineStyle}>San Francisco · Pacific Heights · Noe Valley</div>
        <h1 style={headlineStyle}>Where the light<br /><em style={{ fontStyle: 'italic' }}>never leaves.</em></h1>
        <p style={subStyle}>Discover exceptional homes in San Francisco's most coveted neighborhoods, curated by people who know these streets by heart.</p>
        <SearchBar onSearch={onSearch} />
      </div>

      <div style={scrollHintStyle}>
        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6870' }}>Scroll</span>
        <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, #6B6870, transparent)' }}></div>
      </div>
    </section>
  );
};

Object.assign(window, { HeroSection });
