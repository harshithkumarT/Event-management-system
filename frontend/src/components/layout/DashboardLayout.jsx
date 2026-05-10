import { Link, NavLink, Outlet } from 'react-router-dom';
import { Bell, CalendarRange, ChartColumn, Home, Layers3, LogOut, Settings, Shield, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

const userNav = [
  { label: 'Profile', to: '/dashboard/profile', icon: Home },
  { label: 'Bookings', to: '/dashboard/bookings', icon: Ticket },
  { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

const adminNav = [
  { label: 'Overview', to: '/admin', icon: ChartColumn },
  { label: 'Events', to: '/admin/events', icon: CalendarRange },
  { label: 'Users', to: '/admin/users', icon: Shield },
  { label: 'Bookings', to: '/admin/bookings', icon: Layers3 },
  { label: 'Analytics', to: '/admin/analytics', icon: ChartColumn },
  { label: 'Revenue', to: '/admin/reports', icon: Ticket },
];

export const DashboardLayout = ({ admin = false }) => {
  const { user, logout } = useAuth();
  const navItems = admin ? adminNav : userNav;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/95 p-5">
          <Link to="/" className="mb-8 flex items-center gap-3 text-lg font-semibold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-cyan-300 text-slate-950">
              <Ticket className="h-5 w-5" />
            </span>
            EventFlow
          </Link>
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="mt-1 font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.role}</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${isActive ? 'bg-accent-500 text-white' : 'text-slate-300 hover:bg-white/5'}`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <Button variant="ghost" className="mt-8 w-full justify-start" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>
        <div>
          <header className="border-b border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur-xl lg:px-8">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{admin ? 'Admin Dashboard' : 'User Dashboard'}</p>
          </header>
          <main className="p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};