import { NavLink, Outlet, Link } from "react-router-dom";
import StatsBar from "../admin/StatsBar";
import { usePendingCount } from "../../hooks/usePendingCount";

const navItems = [
  { to: "/admin", label: "Review Queue", end: true, showBadge: true },
  { to: "/admin/listings", label: "All Listings" },
  { to: "/admin/owners", label: "Owners" },
  { to: "/admin/activity", label: "Activity" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminLayout() {
  const { count: pendingCount } = usePendingCount();

  const linkClasses = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-brand-green-deep text-white"
        : "text-brand-earth hover:bg-brand-green-deep/10"
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `relative flex-1 text-center py-3 text-sm font-medium ${
      isActive ? "text-brand-green-deep" : "text-gray-500"
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-white border-r border-gray-200 p-4">
        <Link
          to="/"
          className="mb-4 px-2 text-xl font-bold text-brand-green-deep hover:text-brand-gold transition-colors"
        >
          EPH
        </Link>
        <h2 className="text-brand-gold font-bold text-lg mb-6 px-2">Admin</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClasses}
            >
              <span>{item.label}</span>
              {item.showBadge && pendingCount > 0 && (
                <span
                  className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-brand-gold text-white text-xs font-semibold"
                  aria-label={`${pendingCount} pending listings`}
                >
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <span className="text-brand-gold font-bold text-lg">Admin</span>
        <Link
          to="/"
          className="text-lg font-bold text-brand-green-deep hover:text-brand-gold transition-colors"
        >
          EPH
        </Link>
      </header>

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
            {item.showBadge && pendingCount > 0 && (
              <span
                className="absolute top-1 right-1/4 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-brand-gold text-white text-[10px] font-semibold flex items-center justify-center"
                aria-label={`${pendingCount} pending listings`}
              >
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AdminLayout;
