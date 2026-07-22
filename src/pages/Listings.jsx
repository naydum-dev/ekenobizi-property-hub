import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import PropertyCard from "../components/listings/PropertyCard";
import PropertyCardSkeleton from "../components/ui/PropertyCardSkeleton";
import ListingsFilter from "../components/listings/ListingsFilter";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

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

  const fetchListings = useCallback(async () => {
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
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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
        <div className="mb-6">
          <label htmlFor="listing-search" className="sr-only">
            Search listings
          </label>
          <input
            id="listing-search"
            type="search"
            placeholder="Search listings by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green placeholder-gray-400"
          />
        </div>

        {/* Filter bar */}
        <div className="mb-8">
          <ListingsFilter
            villages={villages}
            filters={filters}
            onChange={setFilters}
            onClearSearch={() => setSearchInput("")}
          />
        </div>

        {/* Error state */}
        {error && <ErrorMessage message={error} onRetry={fetchListings} />}

        {/* Skeleton loaders */}
        {!error && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && properties.length === 0 && (
          <>
            {filters.category || filters.village || filters.search ? (
              <EmptyState
                icon="🔍"
                title="No listings match your filters"
                message="Try a different search term or clear your filters to see all available properties."
                ctaLabel="Clear Filters"
                onCtaClick={() => {
                  setSearchInput("");
                  setFilters({ category: "", village: "", search: "" });
                }}
              />
            ) : (
              <EmptyState
                icon="🏡"
                title="No listings yet"
                message="New verified properties are added regularly — check back soon."
              />
            )}
          </>
        )}

        {/* Results count + grid */}
        {!loading && !error && properties.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {properties.length}{" "}
              {properties.length === 1 ? "listing" : "listings"} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
