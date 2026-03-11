import { NavLink } from 'react-router-dom';

const NAV = [
  {
    label: 'Dashboard',
    path: '/admin-dashboard',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Activity Logs',
    path: '/admin-dashboard#logs',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col border-r h-full"
      style={{ background: 'var(--dark-800)', borderColor: 'var(--dark-500)' }}
    >
      <nav className="flex-1 p-3 pt-5 space-y-1">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-widest px-4 mb-3">
          Navigation
        </p>
        {NAV.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--dark-500)' }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">API Connected</span>
        </div>
      </div>
    </aside>
  );
}