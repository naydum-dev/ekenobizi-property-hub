import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function formatCategory(category) {
  const labels = {
    land_for_sale: "Land for Sale",
    house_for_sale: "House for Sale",
    house_for_rent: "House for Rent",
    shop_for_rent: "Shop for Rent",
  };
  return labels[category] || category;
}

function formatPrice(price) {
  if (!price) return "Price on request";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    active: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  const labels = {
    pending: "Pending",
    active: "Live",
    rejected: "Rejected",
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {labels[status] || status}
    </span>
  );
}

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  async function fetchMyListings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        villages ( name ),
        property_images ( storage_path, is_primary )
      `,
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching my listings:", error);
      setLoading(false);
      return;
    }

    setListings(data);
    setLoading(false);
  }

  async function handleDelete(propertyId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? This cannot be undone.",
    );
    if (!confirmed) return;

    const { error: imagesError } = await supabase
      .from("property_images")
      .delete()
      .eq("property_id", propertyId);

    if (imagesError) {
      console.error("Error deleting property images:", imagesError);
      alert("Something went wrong deleting this listing. Please try again.");
      return;
    }

    const { error: propertyError } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (propertyError) {
      console.error("Error deleting property:", propertyError);
      alert("Something went wrong deleting this listing. Please try again.");
      return;
    }

    setListings((prev) => prev.filter((p) => p.id !== propertyId));
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading your listings...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">
          You haven't submitted any listings yet.
        </p>
        <Link
          to="/owner/submit"
          className="inline-block px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-deep transition"
        >
          Submit a Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-6">
        My Listings
      </h1>

      <div className="space-y-4">
        {listings.map((property) => {
          const primaryImage =
            property.property_images?.find((img) => img.is_primary) ||
            property.property_images?.[0];

          return (
            <div
              key={property.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex gap-4"
            >
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage.storage_path}
                    alt={`Photo of ${property.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {property.title}
                  </h2>
                  <StatusBadge status={property.status} />
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {formatCategory(property.category)} ·{" "}
                  {property.villages?.name}
                </p>
                <p className="text-sm text-brand-gold font-medium">
                  {formatPrice(property.price)}
                </p>
                {property.status === "pending" && (
                  <Link
                    to={`/owner/edit/${property.id}`}
                    className="inline-block mt-2 mr-3 text-sm text-brand-green hover:text-brand-green-deep underline"
                  >
                    Edit
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(property.id)}
                  className="inline-block mt-2 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
