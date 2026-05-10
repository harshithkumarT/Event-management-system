import { Link, NavLink } from 'react-router-dom';
import { Menu, MoonStar, SunMedium, Ticket, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-cyan-300 text-slate-950 shadow-lg shadow-accent-500/30">
            <Ticket className="h-5 w-5" />
          </span>
          EventFlow
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'text-white' : 'text-slate-300 hover:text-white')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
          {isAuthenticated ? (
            <>
              <Button as={Link} to={user?.role === 'admin' ? '/admin' : '/dashboard/profile'} variant="secondary" size="sm">
                {user?.name?.split(' ')[0] || 'Dashboard'}
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 text-slate-200 hover:bg-white/5">
                {item.label}
              </NavLink>
            ))}
            <Button variant="secondary" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </Button>
            {isAuthenticated ? (
              <>
                <Button as={Link} to={user?.role === 'admin' ? '/admin' : '/dashboard/profile'} variant="secondary" onClick={() => setOpen(false)}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" onClick={() => setOpen(false)}>
                  Login
                </Button>
                <Button as={Link} to="/register" onClick={() => setOpen(false)}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};