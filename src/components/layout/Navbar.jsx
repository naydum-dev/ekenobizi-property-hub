import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/ekenobizi-property-hub-logo.jpeg";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/");
    setMenuOpen(false);
  }

  return (
    <nav className="bg-brand-green-deep text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="EPH Logo"
            className="h-10 w-15 rounded-lg object-cover"
          />
          <span className="text-brand-gold font-semibold text-base leading-tight hidden sm:block">
            Ekenobizi
            <br />
            Property Hub
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <Link
            to="/listings"
            className="hover:text-brand-gold transition-colors"
          >
            Browse
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-brand-gold transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-brand-gold text-white px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-brand-gold transition-colors"
              >
                Dashboard
              </Link>
              {profile?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-brand-gold transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded transition-colors text-sm"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-green border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-brand-gold"
          >
            Home
          </Link>
          <Link
            to="/listings"
            onClick={() => setMenuOpen(false)}
            className="hover:text-brand-gold"
          >
            Browse
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:text-brand-gold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="hover:text-brand-gold"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="hover:text-brand-gold"
              >
                Dashboard
              </Link>
              {profile?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-brand-gold"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="text-left hover:text-brand-gold"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
