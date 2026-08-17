import { Bell, Bookmark, BriefcaseBusiness, FileText, LayoutDashboard, LogOut, Search, Settings, Sparkles, UserRound, X, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ open, onClose, currentTab, onChangeTab }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isCandidate = user?.role === 'candidate';

  const candidateItems = [
    { label: 'Dashboard', id: 'overview', icon: LayoutDashboard },
    { label: 'Find Jobs', id: 'find-jobs', href: '/jobs', icon: Search },
    { label: 'My Applications', id: 'applications', icon: BriefcaseBusiness },
    { label: 'Saved Jobs', id: 'saved', icon: Bookmark },
    { label: 'Resume & Profile', id: 'profile', icon: UserRound },
  ];

  const recruiterItems = [
    { label: 'Dashboard', id: 'overview', icon: LayoutDashboard },
    { label: 'Post a Job', id: 'post-job', icon: PlusCircle },
    { label: 'Manage Jobs', id: 'manage-jobs', icon: BriefcaseBusiness },
    { label: 'Company Profile', id: 'profile', icon: UserRound },
  ];

  const items = isCandidate ? candidateItems : recruiterItems;

  const handleItemClick = (item) => {
    onClose();
    if (item.href) {
      // Navigate to external link
      return;
    }
    if (onChangeTab) {
      onChangeTab(item.id);
    }
  };

  return (
    <>
      {open && <button type="button" className="dashboard-sidebar-scrim" aria-label="Close dashboard navigation" onClick={onClose} />}
      <aside className={`dashboard-sidebar ${open ? 'is-open' : ''}`}>
        <div className="dashboard-sidebar-header">
          <Link to="/" className="brand dashboard-brand" onClick={onClose}>
            <span className="brand-mark"><Sparkles size={14} strokeWidth={2.8} /></span>
            <span>Hire<span>Flow</span></span>
          </Link>
          <button type="button" className="dashboard-close-sidebar" onClick={onClose} aria-label="Close dashboard navigation"><X size={18} /></button>
        </div>
        <div className="dashboard-sidebar-profile">
          <span className="dashboard-avatar dashboard-avatar-large">
            {getInitials(user?.name)}
          </span>
          <span className="truncate max-w-[180px]">
            <strong>{user?.name || 'User'}</strong>
            <small>{isCandidate ? 'Candidate' : `${user?.company_name || 'Recruiter'}`}</small>
          </span>
        </div>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <span className="dashboard-nav-label">Workspace</span>
          {items.map((item) => {
            const isActive = item.href 
              ? location.pathname === item.href 
              : currentTab === item.id;

            if (item.href) {
              return (
                <Link 
                  key={item.label} 
                  to={item.href} 
                  onClick={() => handleItemClick(item)} 
                  className={`dashboard-nav-item ${isActive ? 'is-active' : ''}`}
                >
                  <item.icon size={17} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`dashboard-nav-item w-full text-left cursor-pointer ${isActive ? 'is-active' : ''}`}
              >
                <item.icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <Link to="/" className="dashboard-logout" onClick={() => { logout(); onClose(); }}><LogOut size={17} /> Log out</Link>
      </aside>
    </>
  );
}