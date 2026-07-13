import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/sports', label: 'Sports' },
  { to: '/diet-plans', label: 'Diet Plans' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/reports', label: 'Reports' },
  { to: '/notifications', label: 'Notifications' },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">T</div>
          Thala Admin
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{user?.email}</div>
          <button className="btn secondary" style={{ width: '100%' }} onClick={logout}>
            Log Out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
