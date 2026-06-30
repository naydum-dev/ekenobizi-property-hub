import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    to: "/owner",
    label: "My Listings",
    end: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
  },
  {
    to: "/owner/submit",
    label: "Submit Listing",
    end: false,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
  {
    to: "/owner/profile",
    label: "Profile",
    end: false,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
    isActive ? "bg-brand-gold text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

const mobileLinkClasses = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium ${
    isActive ? "text-brand-gold" : "text-gray-500"
  }`;

export default function OwnerLayout() {
  const { profile, signOut } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 px-4 py-6">
        <div className="mb-8 px-2">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="text-lg font-bold text-brand-green-deep truncate">
            {firstName}
          </p>
        </div>

        <nav
          className="flex flex-col gap-1"
          aria-label="Owner dashboard navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClasses}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={signOut}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
        <p className="text-sm text-gray-500">Welcome back,</p>
        <p className="text-lg font-bold text-brand-green-deep">{firstName}</p>
      </header>

      {/* Page content */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-20"
        aria-label="Owner dashboard navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={mobileLinkClasses}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
