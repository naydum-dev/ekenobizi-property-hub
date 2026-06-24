const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "land_for_sale", label: "Land for Sale" },
  { value: "house_for_sale", label: "House for Sale" },
  { value: "house_for_rent", label: "House for Rent" },
  { value: "shop_for_rent", label: "Shop for Rent" },
];

export default function ListingsFilter({
  villages,
  filters,
  onChange,
  onClearSearch,
}) {
  const hasActiveFilter = filters.category || filters.village || filters.search;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4">
      {/* Category filter */}
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Village filter */}
      <select
        value={filters.village}
        onChange={(e) => onChange({ ...filters, village: e.target.value })}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green"
      >
        <option value="">All Villages</option>
        {villages.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      {/* Clear all */}
      {hasActiveFilter && (
        <button
          onClick={() => {
            onChange({ category: "", village: "", search: "" });
            onClearSearch();
          }}
          className="text-sm text-brand-earth underline hover:text-brand-green-deep transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
