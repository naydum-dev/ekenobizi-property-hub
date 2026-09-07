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
    // Supabase's recovery link logs the user in and fires this event —
    // there's no token to parse manually. Until this fires, we don't
    // know whether the visitor arrived via a valid link.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // If the event hasn't fired shortly after mount, the link was
    // invalid, expired, or the page was opened directly.
    const timeout = setTimeout(() => {
      setReady((currentReady) => {
        if (!currentReady) setExpired(true);
        return currentReady;
      });
    }, 4000);

    return () => {
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
