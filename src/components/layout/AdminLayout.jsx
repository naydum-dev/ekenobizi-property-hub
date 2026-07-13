import { NavLink, Outlet } from "react-router-dom";
import StatsBar from "../admin/StatsBar";

const navItems = [
  { to: "/admin", label: "Review Queue", end: true },
  { to: "/admin/listings", label: "All Listings" },
  { to: "/admin/owners", label: "Owners" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminLayout() {
  const linkClasses = ({ isActive }) =>
    `block px-4 py-3 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-brand-green-deep text-white"
        : "text-brand-earth hover:bg-brand-green-deep/10"
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `flex-1 text-center py-3 text-sm font-medium ${
      isActive ? "text-brand-green-deep" : "text-gray-500"
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-white border-r border-gray-200 p-4">
        <h2 className="text-brand-gold font-bold text-lg mb-6 px-2">Admin</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClasses}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        <main className="flex-1 p-4 md:p-8">
          <StatsBar />
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-10"
        aria-label="Admin navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={mobileLinkClasses}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AdminLayout;
