import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/ekenobizi-property-hub-logo.jpeg";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // The `profiles` row is now created automatically by a database trigger
    // (see handle_new_user()) — no client-side insert needed, and no session
    // is required for it to succeed, since it runs server-side.

    setLoading(false);
    setConfirmationSent(true);
  }

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-brand-green-deep flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <img
            src={logo}
            alt="Ekenobizi Property Hub"
            className="w-20 h-20 mx-auto mb-4 rounded-lg object-contain"
          />
          <h1 className="text-brand-green-deep text-2xl font-bold mb-2">
            Check your email
          </h1>
          <p className="text-brand-earth text-sm">
            We've sent a confirmation link to <strong>{formData.email}</strong>.
            Please confirm your email before logging in.
          </p>
        </div>
      </div>
    );
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
          Join Ekenobizi Property Hub
        </h1>
        <p className="text-brand-earth text-sm text-center mb-6">
          Your Community. Your Property. Your Trust.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-brand-earth mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-gold font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
