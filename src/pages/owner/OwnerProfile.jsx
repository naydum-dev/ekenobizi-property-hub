import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/ui/ErrorMessage";

const OwnerProfile = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Prefill form once profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setWhatsappNumber(profile.whatsapp_number || "");
    }
  }, [profile]);

  // Fetch listing stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      setStatsLoading(true);
      setStatsError(null);

      const { data, error } = await supabase
        .from("properties")
        .select("status")
        .eq("owner_id", user.id);

      if (error) {
        console.error("Error fetching listing stats:", error.message);
        setStatsError("Could not load your listing stats.");
        setStatsLoading(false);
        return;
      }

      const total = data.length;
      const approved = data.filter((p) => p.status === "approved").length;
      const pending = data.filter((p) => p.status === "pending").length;
      const rejected = data.filter((p) => p.status === "rejected").length;

      setStats({ total, approved, pending, rejected });
      setStatsLoading(false);
    };

    fetchStats();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        whatsapp_number: whatsappNumber.trim() || null,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error.message);
      setSaveError("Could not save your changes. Please try again.");
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-6">
        My Profile
      </h1>

      {/* Listing stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Your Listings
        </h2>

        {statsLoading ? (
          <p className="text-sm text-gray-400">Loading stats...</p>
        ) : statsError ? (
          <ErrorMessage message={statsError} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-brand-green-deep">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-gold">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {stats.rejected}
              </p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">
            Email cannot be changed here.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default WhatsApp Number{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="e.g. 08012345678"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          <p className="text-xs text-gray-400 mt-1">
            Pre-fills the WhatsApp field when you submit a new listing. You can
            still change it per listing.
          </p>
        </div>

        {saveError && <ErrorMessage message={saveError} />}
        {saveSuccess && (
          <p className="text-sm text-green-600 font-medium">
            Profile updated successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-green-deep text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default OwnerProfile;
