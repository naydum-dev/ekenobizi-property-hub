import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  async function fetchOwners() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, is_verified_owner, properties(count)")
      .eq("role", "owner")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching owners:", error);
      setError("Failed to load owners.");
      setLoading(false);
      return;
    }

    setOwners(data);
    setLoading(false);
  }

  async function handleToggleVerified(ownerId, currentStatus) {
    const newStatus = !currentStatus;

    const { error } = await supabase
      .from("profiles")
      .update({ is_verified_owner: newStatus })
      .eq("id", ownerId);

    if (error) {
      console.error("Error updating verified status:", error);
      alert("Failed to update verified status. Please try again.");
      return;
    }

    setOwners((prev) =>
      prev.map((owner) =>
        owner.id === ownerId
          ? { ...owner, is_verified_owner: newStatus }
          : owner,
      ),
    );
  }

  if (loading) {
    return <p className="p-4 text-brand-earth">Loading owners...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-4">
        Manage Owners
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-brand-earth">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-brand-earth">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-brand-earth">
                Verified Owner
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-brand-earth">
                Listings
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {owner.full_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {owner.phone || "—"}
                </td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() =>
                      handleToggleVerified(owner.id, owner.is_verified_owner)
                    }
                    aria-label={
                      owner.is_verified_owner
                        ? `Revoke verified status for ${owner.full_name}`
                        : `Mark ${owner.full_name} as verified owner`
                    }
                    className={
                      owner.is_verified_owner
                        ? "px-3 py-1 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green border border-brand-green"
                        : "px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-300"
                    }
                  >
                    {owner.is_verified_owner ? "Verified" : "Not Verified"}
                  </button>
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {owner.properties?.[0]?.count ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {owners.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No owners found yet.</p>
      )}
    </div>
  );
}
