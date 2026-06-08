import { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  Share2,
  Lock,
  UserCircle,
  Bell,
  LogOut
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { LoginPage } from './pages/LoginPage';
import { EasyListingModule } from './pages/EasyListingModule';
import { CRMModule } from './pages/CRMModule';
import { TheCuratorModule } from './pages/TheCuratorModule';
import { TheScribeModule } from './pages/TheScribeModule';
import { CloserModule } from './pages/CloserModule';
import './index.css';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to admin role handling
  const userRole = user?.role || 'viewer';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-400 text-4xl mb-4">⏳</div>
          <p className="text-white">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-name">SIERRA ESTATES</span>
          <span className="brand-role">
            <Lock size={10} />
            {userRole === 'super_admin' ? 'Intelligence OS' : 'Agent Portal'}
          </span>
        </div>

        <nav className="nav-links">
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={18} /> Master Overview
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'intake' ? 'active' : ''}`} onClick={() => setActiveTab('intake')}>
              <MessageSquare size={18} /> The Scribe (S1–2)
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
              <Database size={18} /> The Curator (S3–5)
            </div>
          )}
          <div className={`nav-item ${activeTab === 'easylisting' ? 'active' : ''}`} onClick={() => setActiveTab('easylisting')}>
            <Share2 size={18} /> EasyListing Hub
          </div>
          <div className={`nav-item ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>
            <Users size={18} /> Matchmaker (S6–8)
          </div>
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'closer' ? 'active' : ''}`} onClick={() => setActiveTab('closer')}>
              <TrendingUp size={18} /> The Closer (S9–10)
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={18} /> System Config
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              <UserCircle size={22} />
            </div>
            <div>
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="notification-bell">
              <Bell size={19} />
              <span className="notification-dot" />
            </div>
            <div style={{ height: '18px', width: '1px', backgroundColor: 'var(--border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>V12.0 Stable</span>
          </div>
        </header>

        <div className="content-viewport">
          {activeTab === 'overview' && (
            <div className="overview-page animate-fade-in">
              <h1 className="overview-headline">
                Intelligence <span style={{ color: 'var(--gold)' }}>Mastery</span>
              </h1>
              <p className="overview-sub">
                Welcome to the Sierra Estates Strategic Dashboard. All 10 stages of the Intelligence Pipeline are operational.
              </p>
              <div className="overview-grid">
                {[
                  { stage: 'S1–2', label: 'Ingestion Active', color: '#38bdf8' },
                  { stage: 'S3–5', label: 'Inventory Synced', color: 'var(--gold)' },
                  { stage: 'S6–10', label: 'Matching Ready', color: '#22c55e' },
                ].map(({ stage, label, color }) => (
                  <div key={stage} className="overview-stat-card">
                    <h4 style={{ color, margin: '0 0 0.5rem', fontWeight: 600 }}>{stage}</h4>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</p>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'intake'     && <TheScribeModule />}
          {activeTab === 'inventory'  && <TheCuratorModule />}
          {activeTab === 'easylisting' && <EasyListingModule currentUserRole={userRole} currentUserId={user.id} />}
          {activeTab === 'crm'        && <CRMModule currentUserRole={userRole} currentUserId={user.id} />}
          {activeTab === 'closer'     && <CloserModule />}
          {activeTab === 'settings'   && (
            <div className="settings-placeholder animate-fade-in">
              <Settings size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <h2 style={{ fontWeight: 300, margin: '0 0 0.5rem' }}>System Settings</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Configuration module — coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
