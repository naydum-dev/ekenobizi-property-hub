import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

export default function BecomeAgent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("agent_status, business_name, is_verified_agent")
      .eq("id", user.id)
      .single();

    if (error) {
      setError("Could not load your application status.");
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!businessName.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!file) {
      setError("Please upload your business registration document.");
      return;
    }

    setSubmitting(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/business-doc.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("agent-documents")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          business_name: businessName.trim(),
          business_doc_url: filePath,
          agent_status: "pending",
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setSuccess("Application submitted! We'll review it and get back to you.");
      fetchProfile();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!profile) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  // Approved
  if (profile.is_verified_agent) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-[#14532D] mb-2">
            You're a Verified Agent
          </h2>
          <p className="text-gray-600">
            Listing as{" "}
            <span className="font-medium">{profile.business_name}</span>. Your
            listings now carry the agent badge.
          </p>
        </div>
      </div>
    );
  }

  // Pending
  if (profile.agent_status === "pending") {
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-[#B07D2A] mb-2">
            Application Under Review
          </h2>
          <p className="text-gray-600">
            We're reviewing your application for{" "}
            <span className="font-medium">{profile.business_name}</span>. This
            usually doesn't take long.
          </p>
        </div>
      </div>
    );
  }

  // 'none' or 'rejected' — show the form
  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-[#14532D] mb-1">
          Become a Verified Agent
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Submit your business details for review. Once approved, your listings
          will show a verified agent badge with your business name.
        </p>

        {profile.agent_status === "rejected" && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">
            Your previous application wasn't approved. You're welcome to reapply
            below.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              placeholder="e.g. Obia Properties Ltd"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Registration Document
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#14532D] text-white py-2 rounded-md hover:bg-[#0f3f22] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
