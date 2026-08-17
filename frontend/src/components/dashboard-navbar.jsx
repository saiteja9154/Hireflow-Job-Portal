import { Bell, ChevronDown, HelpCircle, Menu, Search, UserRound, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function TopNavbar({ search, onSearch, onOpenSidebar, showSearch = true }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="dashboard-topbar">
      <button type="button" className="dashboard-menu-button" onClick={onOpenSidebar} aria-label="Open dashboard navigation"><Menu size={20} /></button>
      
      {showSearch ? (
        <div className="dashboard-search">
          <Search size={16} aria-hidden="true" />
          <input 
            type="search" 
            value={search || ''} 
            onChange={(event) => onSearch && onSearch(event.target.value)} 
            placeholder="Search jobs, companies, skills..." 
            aria-label="Search jobs" 
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="dashboard-topbar-actions">
        <button type="button" className="dashboard-icon-button" aria-label="Help"><HelpCircle size={18} /></button>
        <button type="button" className="dashboard-icon-button dashboard-notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
        <div className="dashboard-profile-menu">
          <button type="button" className="dashboard-profile-button cursor-pointer" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
            <span className="dashboard-avatar">{getInitials(user?.name)}</span>
            <span className="dashboard-profile-name">{user?.name || 'User'}<small>{user?.role === 'candidate' ? 'Candidate' : 'Recruiter'}</small></span>
            <ChevronDown size={15} />
          </button>
          {profileOpen && (
            <div className="dashboard-profile-dropdown">
              <button 
                type="button" 
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer" 
                onClick={() => { setProfileOpen(false); }}
              >
                <UserRound size={15} /> My workspace
              </button>
              <button 
                type="button" 
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer" 
                onClick={() => { logout(); setProfileOpen(false); }}
              >
                <LogOut size={15} className="text-red-500" /> <span className="text-red-600 font-medium">Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}