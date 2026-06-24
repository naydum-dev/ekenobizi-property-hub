import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import PropertyCard from "../components/listings/PropertyCard";
import PropertyCardSkeleton from "../components/ui/PropertyCardSkeleton";
import ListingsFilter from "../components/listings/ListingsFilter";

export default function Listings() {
  const [properties, setProperties] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    village: "",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");

  // Debounce: sync searchInput into filters.search after 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch villages once on mount
  useEffect(() => {
    async function fetchVillages() {
      const { data } = await supabase
        .from("villages")
        .select("id, name")
        .order("name");
      if (data) setVillages(data);
    }
    fetchVillages();
  }, []);

  // Fetch listings whenever filters change
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("properties")
        .select(
          `
          *,
          villages ( name ),
          property_images ( storage_path, is_primary )
        `,
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filters.category) query = query.eq("category", filters.category);
      if (filters.village) query = query.eq("village_id", filters.village);
      if (filters.search) query = query.ilike("title", `%${filters.search}%`);

      const { data, error } = await query;

      if (error) {
        setError("Failed to load listings. Please try again.");
      } else {
        setProperties(data);
      }

      setLoading(false);
    }

    fetchListings();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-brand-green-deep py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white">Browse Listings</h1>
        <p className="text-green-200 mt-2 text-sm">
          All properties are human-reviewed before going live.
        </p>
      </div>

      {/* Listings Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search listings by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Filter bar */}
        <ListingsFilter
          villages={villages}
          filters={filters}
          onChange={setFilters}
          onClearSearch={() => setSearchInput("")}
        />

        {/* Error state */}
        {error && <div className="text-center text-red-600 py-12">{error}</div>}

        {/* Skeleton loaders */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No listings found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Try a different search term or clear your filters.
            </p>
          </div>
        )}

        {/* Property grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
