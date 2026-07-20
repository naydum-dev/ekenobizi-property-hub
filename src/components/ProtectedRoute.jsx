import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading } = useAuth();

  // 1. Auth state is still being determined — don't make any decision yet.
  // Without this check, a logged-in user could get bounced to /login
  // for a split second on every page refresh, before their session loads.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-brand-green-deep">
        <div
          className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"
          role="status"
          aria-label="Checking your session"
        />
        <p className="text-white/80 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  // 2. Loading is done, and there is no logged-in user at all.
  // `replace` means this redirect doesn't get added to browser history,
  // so clicking "back" won't bounce the user into a redirect loop.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. There IS a user, but this route requires admin access,
  // and their profile role is not "admin".
  // Note: we check `profile?.role` with optional chaining —
  // if the profile hasn't loaded for any reason, this fails safe
  // (denies access) instead of throwing an error.
  if (requireAdmin && profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. Passed every check — render the actual protected page.
  return children;
}

export default ProtectedRoute;
