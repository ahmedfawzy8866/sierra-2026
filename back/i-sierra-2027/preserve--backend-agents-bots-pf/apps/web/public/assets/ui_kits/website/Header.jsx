// Header.jsx — Meridian Properties Navigation
// Frosted-glass nav bar with wordmark, links, CTA

const Header = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Buy', page: 'listings' },
    { label: 'Rent', page: 'rent' },
    { label: 'Sell', page: 'sell' },
    { label: 'Agents', page: 'agents' },
    { label: 'Journal', page: 'journal' },
  ];

  const headerStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 48px', height: '68px',
    background: scrolled
      ? 'rgba(250,248,244,0.95)'
      : 'rgba(12,12,15,0.75)',
    backdropFilter: 'blur(20px)',
    borderBottom: scrolled
      ? '1px solid rgba(12,12,15,0.10)'
      : '1px solid rgba(242,237,228,0.08)',
    transition: 'background 400ms ease, border-color 400ms ease',
  };

  const wordmarkStyle = {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    fontSize: '22px', fontWeight: 300, letterSpacing: '0.26em',
    textTransform: 'uppercase', cursor: 'pointer',
    color: scrolled ? '#0C0C0F' : '#F2EDE4',
    transition: 'color 400ms ease',
  };

  const linkStyle = (page) => ({
    fontFamily: 'Jost, sans-serif',
    fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em',
    textTransform: 'uppercase', cursor: 'pointer',
    color: currentPage === page
      ? '#C4963A'
      : scrolled ? '#6B6870' : '#A8A5B0',
    transition: 'color 300ms ease',
    padding: '4px 0',
  });

  const ctaStyle = {
    fontFamily: 'Jost, sans-serif',
    fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em',
    textTransform: 'uppercase', cursor: 'pointer',
    background: '#C4963A', color: '#0C0C0F',
    padding: '9px 22px', borderRadius: '2px', border: 'none',
    transition: 'background 300ms ease',
  };

  return (
    <header style={headerStyles}>
      <div style={wordmarkStyle} onClick={() => onNavigate('home')}>Meridian</div>
      <nav style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
        {navLinks.map(({ label, page }) => (
          <span key={page} style={linkStyle(page)} onClick={() => onNavigate(page)}>{label}</span>
        ))}
      </nav>
      <button style={ctaStyle} onMouseOver={e => e.target.style.background='#E8C47A'} onMouseOut={e => e.target.style.background='#C4963A'}>
        Contact us
      </button>
    </header>
  );
};

Object.assign(window, { Header });
