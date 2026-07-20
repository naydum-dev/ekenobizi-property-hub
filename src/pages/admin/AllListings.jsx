import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { logAction } from "../../utils/auditLog";
import VerifiedBadge from "../../components/ui/VerifiedBadge";

export default function AllListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // same column clicked again -> flip direction
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // new column -> default to ascending
      return { key, direction: "asc" };
    });
  }

  function sortIndicator(key) {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  }

  async function handleDelete(id, title) {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    // manual cascade - images first, then the property row (no DB-level cascade exists)
    const { error: imagesError } = await supabase
      .from("property_images")
      .delete()
      .eq("property_id", id);

    if (imagesError) {
      alert(`Failed to delete images: ${imagesError.message}`);
      return;
    }

    const { error: propertyError } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (propertyError) {
      alert(`Failed to delete listing: ${propertyError.message}`);
      return;
    }

    // update local state directly rather than re-fetching
    setListings((prev) => prev.filter((listing) => listing.id !== id));

    logAction("delete", id);
  }

  const sortedListings = useMemo(() => {
    // filter first - narrows the array before the more expensive sort step
    const filtered =
      statusFilter === "all"
        ? [...listings]
        : listings.filter((listing) => listing.status === statusFilter);

    const searched = searchTerm.trim()
      ? filtered.filter((listing) =>
          listing.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        )
      : filtered;

    searched.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // village name lives one level deep in the joined object
      if (sortConfig.key === "village") {
        valA = a.villages?.name ?? "";
        valB = b.villages?.name ?? "";
      }

      if (sortConfig.key === "created_at") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }

      // string comparison for category / status / village
      const comparison = String(valA).localeCompare(String(valB));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return searched;
  }, [listings, sortConfig, statusFilter, searchTerm]);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        id,
        title,
        category,
        status,
        is_verified,
        created_at,
        villages ( name )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setListings([]);
    } else {
      setListings(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <p className="p-6 text-brand-earth">Loading listings...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">Error loading listings: {error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-4">
        All Listings
      </h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="statusFilter"
            className="text-sm font-medium text-brand-earth"
          >
            Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="titleSearch"
            className="text-sm font-medium text-brand-earth"
          >
            Search:
          </label>
          <input
            id="titleSearch"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-brand-earth">
                Title
              </th>
              <th
                className="px-4 py-3 font-semibold text-brand-earth cursor-pointer select-none"
                onClick={() => handleSort("category")}
              >
                Category{sortIndicator("category")}
              </th>
              <th
                className="px-4 py-3 font-semibold text-brand-earth cursor-pointer select-none"
                onClick={() => handleSort("village")}
              >
                Village{sortIndicator("village")}
              </th>
              <th
                className="px-4 py-3 font-semibold text-brand-earth cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                Status{sortIndicator("status")}
              </th>
              <th
                className="px-4 py-3 font-semibold text-brand-earth cursor-pointer select-none"
                onClick={() => handleSort("created_at")}
              >
                Date Submitted{sortIndicator("created_at")}
              </th>
              <th className="px-4 py-3 font-semibold text-brand-earth">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedListings.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No listings found.
                </td>
              </tr>
            )}

            {sortedListings.map((listing) => (
              <tr
                key={listing.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/admin/listings/${listing.id}`}
                    className="text-brand-green hover:underline font-medium"
                  >
                    {listing.title}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">
                  {listing.category.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3">{listing.villages?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="capitalize">{listing.status}</span>
                  {listing.is_verified && (
                    <span className="ml-2">
                      <VerifiedBadge />
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {new Date(listing.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/listings/${listing.id}`}
                      className="text-brand-green hover:underline text-sm font-medium"
                    >
                      View / Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(listing.id, listing.title)}
                      aria-label={`Delete listing ${listing.title}`}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
