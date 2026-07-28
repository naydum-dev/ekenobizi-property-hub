import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <footer className="bg-brand-green-deep text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div>
            <p className="text-brand-gold font-semibold text-lg">
              Ekenobizi Property Hub
            </p>
            <p className="text-sm text-white/70 mt-1 italic">
              Your Community. Your Property. Your Trust.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <Link to="/" className="hover:text-brand-gold transition-colors">
              Home
            </Link>
            <Link
              to="/listings"
              className="hover:text-brand-gold transition-colors"
            >
              Browse Listings
            </Link>

            {user ? (
              <button
                onClick={handleSignOut}
                className="text-left hover:text-brand-gold transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="hover:text-brand-gold transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="hover:text-brand-gold transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Community note */}
          <div className="text-sm text-white/60 max-w-xs">
            <p>
              Serving the Ekenobizi Community,
              <br />
              Umuahia South LGA, Abia State.
            </p>
            <p className="mt-2">
              All listings are human-reviewed before going live.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/40 text-center">
          © {new Date().getFullYear()} Ekenobizi Property Hub. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
