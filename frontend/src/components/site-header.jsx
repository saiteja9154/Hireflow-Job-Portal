import { ArrowUpRight, Menu, Sparkles, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Find jobs', href: '/jobs' },
  ];

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link to="/" className="brand" data-testid="link-logo">
          <span className="brand-mark"><Sparkles size={15} strokeWidth={2.8} /></span>
          <span>Hire<span>Flow</span></span>
        </Link>
        <button
          type="button"
          className="mobile-menu-button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'main-nav-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-link ${location.pathname === item.href ? 'nav-link-active' : ''}`}
              data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
            </Link>
          ))}
          <span className="nav-divider" aria-hidden="true" />
          
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="nav-link font-medium text-blue-600" data-testid="link-nav-dashboard">
                Dashboard
              </Link>
              <button 
                onClick={() => { logout(); setMenuOpen(false); }} 
                className="nav-link flex items-center gap-1 text-slate-500 cursor-pointer"
                data-testid="button-nav-logout"
              >
                <LogOut size={15} /> Log out
              </button>
              {user.role === 'recruiter' && (
                <Link to="/dashboard?tab=post-job" onClick={() => setMenuOpen(false)} className="button button-small button-outline animate-pulse" data-testid="link-nav-post-job">
                  Post a job <ArrowUpRight size={15} />
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="nav-link" data-testid="link-nav-login">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="nav-link" data-testid="link-nav-register">Register</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="button button-small button-outline" data-testid="link-nav-post-job">
                Post a job <ArrowUpRight size={15} />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}