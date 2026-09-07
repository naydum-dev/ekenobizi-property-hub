import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/ekenobizi-property-hub-logo.jpeg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      },
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSent(true);
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
          Forgot Password
        </h1>
        <p className="text-brand-earth text-sm text-center mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-3 text-center">
            Check your email for a link to reset your password.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-sm text-center text-brand-earth mt-6">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-brand-gold font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
