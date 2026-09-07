import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/ekenobizi-property-hub-logo.jpeg";

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // The Supabase client parses and consumes the recovery link's URL
    // hash at init time — before this component mounts — so the
    // PASSWORD_RECOVERY event usually fires and is gone before we can
    // listen for it. By the time we render, though, the session it
    // created is already available via getSession(), so check that
    // first as the primary signal.
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        setReady(true);
      }
    });

    // Fallback: in case the hash is still being processed when this
    // component mounts (slower devices/networks), also listen live.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // If neither check finds a session shortly after mount, the link
    // was invalid, expired, already used, or the page was opened directly.
    const timeout = setTimeout(() => {
      setReady((currentReady) => {
        if (!currentReady) setExpired(true);
        return currentReady;
      });
    }, 3000);

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2000);
  }

  return (
    <div className="min-h-screen bg-brand-green-deep flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <img
          src={logo}
          alt="Ekenobizi Property Hub"
          className="w-20 h-20 mx-auto mb-4 rounded-lg object-contain"
        />
        <h1 className="text-brand-green-deep text-2xl font-bold text-center mb-1">
          Reset Password
        </h1>

        {success ? (
          <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-3 text-center mt-6">
            Password updated. Redirecting to login...
          </p>
        ) : expired ? (
          <>
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-3 text-center mt-6">
              This reset link is invalid or has expired.
            </p>
            <p className="text-sm text-center text-brand-earth mt-6">
              <Link
                to="/forgot-password"
                className="text-brand-gold font-semibold hover:underline"
              >
                Request a new link
              </Link>
            </p>
          </>
        ) : !ready ? (
          <p className="text-brand-earth text-sm text-center mt-6">
            Verifying your link...
          </p>
        ) : (
          <>
            <p className="text-brand-earth text-sm text-center mb-6">
              Enter your new password below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green-deep text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
