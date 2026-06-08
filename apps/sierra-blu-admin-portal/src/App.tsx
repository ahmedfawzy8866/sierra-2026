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
  LogOut,
  Sparkles,
  Zap,
  Terminal,
  BarChart2,
  Bot,
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { LoginPage } from './pages/LoginPage';
import { EasyListingModule } from './pages/EasyListingModule';
import { CRMModule } from './pages/CRMModule';
import { OverviewPage } from './pages/OverviewPage';
import { AgentsPage } from './pages/AgentsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { OpenClawPage } from './pages/OpenClawPage';
import { ReportsPage } from './pages/ReportsPage';
import { TheCuratorModule } from './pages/TheCuratorModule';
import { TheScribeModule } from './pages/TheScribeModule';
import { CloserModule } from './pages/CloserModule';
import { LolaAssistantModule } from './pages/LolaAssistantModule';
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
          {/* Main */}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={18} /> Intelligence OS
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
              <Bot size={18} /> Agents & Bots
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'workflows' ? 'active' : ''}`} onClick={() => setActiveTab('workflows')}>
              <Zap size={18} /> Workflows
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'openclaw' ? 'active' : ''}`} onClick={() => setActiveTab('openclaw')}>
              <Terminal size={18} /> OpenClaw Terminal
            </div>
          )}
          {/* Operations */}
          <div className={`nav-item ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>
            <Users size={18} /> CRM · Leads
          </div>
          <div className={`nav-item ${activeTab === 'easylisting' ? 'active' : ''}`} onClick={() => setActiveTab('easylisting')}>
            <Share2 size={18} /> Listings Hub
          </div>
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
              <Database size={18} /> The Curator (S3–5)
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'intake' ? 'active' : ''}`} onClick={() => setActiveTab('intake')}>
              <MessageSquare size={18} /> The Scribe (S1–2)
            </div>
          )}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'closer' ? 'active' : ''}`} onClick={() => setActiveTab('closer')}>
              <TrendingUp size={18} /> Stage-9 Closer
            </div>
          )}
          <div className={`nav-item ${activeTab === 'lola' ? 'active' : ''}`} onClick={() => setActiveTab('lola')}>
            <Sparkles size={18} color="var(--gold)" /> Lola Hub
          </div>
          {/* Analytics */}
          {userRole === 'super_admin' && (
            <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
              <BarChart2 size={18} /> Reports
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
          {activeTab === 'overview'   && <OverviewPage />}
          {activeTab === 'agents'     && <AgentsPage />}
          {activeTab === 'workflows'  && <WorkflowsPage />}
          {activeTab === 'openclaw'   && <OpenClawPage />}
          {activeTab === 'intake'     && <TheScribeModule />}
          {activeTab === 'inventory'  && <TheCuratorModule />}
          {activeTab === 'easylisting' && <EasyListingModule currentUserRole={userRole} currentUserId={user.id} />}
          {activeTab === 'crm'        && <CRMModule currentUserRole={userRole} currentUserId={user.id} />}
          {activeTab === 'closer'     && <CloserModule />}
          {activeTab === 'lola'       && <LolaAssistantModule />}
          {activeTab === 'reports'    && <ReportsPage />}
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
