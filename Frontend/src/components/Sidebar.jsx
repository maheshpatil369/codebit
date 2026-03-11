import { NavLink } from "react-router-dom";

const defaultItems = [
  { label: "Admin Dashboard", path: "/admin-dashboard" },
  { label: "User Dashboard", path: "/dashboard" },
  { label: "Company Dashboard", path: "/company-dashboard" },
];

function NavIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function Sidebar({
  title = "Dashboards",
  subtitle = "Navigation",
  items = defaultItems,
  footerLabel = "API Connected",
}) {
  return (
    <aside
      className="w-full lg:w-64 lg:min-h-screen flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r"
      style={{ background: "rgba(17, 17, 21, 0.92)", borderColor: "var(--dark-500)" }}
    >
      <div className="px-5 pt-6 pb-4 border-b" style={{ borderColor: "var(--dark-500)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, var(--gold-600), var(--gold-400))", color: "#0d0d0f" }}
          >
            LX
          </div>
          <div>
            <p className="font-display text-xl text-gradient font-semibold">LexNova</p>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-[11px] font-medium text-gray-600 uppercase tracking-[0.24em] px-3 mb-3">
          {subtitle}
        </p>
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {item.icon ?? <NavIcon />}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t" style={{ borderColor: "var(--dark-500)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-500">{footerLabel}</span>
        </div>
      </div>
    </aside>
  );
}
