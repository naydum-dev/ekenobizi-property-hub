import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching profiles:", error);
      setError("Failed to load accounts.");
      setLoading(false);
      return;
    }

    setProfiles(data);
    setLoading(false);
  }

  const adminCount = profiles.filter((p) => p.role === "admin").length;

  async function handleToggleAdmin(profileId, currentRole) {
    const isCurrentlyAdmin = currentRole === "admin";
    const isSelf = profileId === user.id;

    // Guard: block demoting yourself if you're the only admin left
    if (isCurrentlyAdmin && isSelf && adminCount <= 1) {
      alert(
        "You can't remove your own admin access — you're the only admin left. Promote another account to admin first.",
      );
      return;
    }

    const newRole = isCurrentlyAdmin ? "owner" : "admin";

    const confirmed = window.confirm(
      isCurrentlyAdmin
        ? "Remove admin access from this account?"
        : "Grant admin access to this account?",
    );
    if (!confirmed) return;

    setUpdatingId(profileId);

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId);

    setUpdatingId(null);

    if (error) {
      console.error("Error updating role:", error);
      alert("Failed to update admin status. Please try again.");
      return;
    }

    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, role: newRole } : p)),
    );
  }

  if (loading) {
    return <p className="p-4 text-brand-earth">Loading accounts...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-1">
        Admin Access
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Grant or remove admin access for any account.
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-brand-earth">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-brand-earth">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-brand-earth">
                Admin Access
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {profiles.map((profile) => {
              const isAdmin = profile.role === "admin";
              const isSelf = profile.id === user.id;

              return (
                <tr key={profile.id}>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {profile.full_name || "—"}
                    {isSelf && (
                      <span className="ml-2 text-xs text-gray-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {profile.email || "—"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() =>
                        handleToggleAdmin(profile.id, profile.role)
                      }
                      disabled={updatingId === profile.id}
                      aria-label={
                        isAdmin
                          ? `Remove admin access from ${profile.full_name}`
                          : `Grant admin access to ${profile.full_name}`
                      }
                      className={
                        isAdmin
                          ? "px-3 py-1 rounded-full text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold disabled:opacity-50"
                          : "px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-300 disabled:opacity-50"
                      }
                    >
                      {updatingId === profile.id
                        ? "Updating..."
                        : isAdmin
                          ? "Admin"
                          : "Not Admin"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {profiles.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No accounts found yet.</p>
      )}
    </div>
  );
}
