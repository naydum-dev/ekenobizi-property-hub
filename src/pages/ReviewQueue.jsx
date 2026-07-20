import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { logAction } from "../utils/auditLog";

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

export default function ReviewQueue() {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingListings();
  }, []);

  async function fetchPendingListings() {
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
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pending listings:", error);
      setLoading(false);
      return;
    }

    setPendingListings(data);
    setLoading(false);
  }

  async function handleReview(propertyId, newStatus) {
    if (newStatus === "rejected") {
      const confirmed = window.confirm(
        "Are you sure you want to reject this listing? The owner will not be notified automatically.",
      );
      if (!confirmed) return;
    }

    const updates =
      newStatus === "active"
        ? { status: newStatus, is_verified: true }
        : { status: newStatus };

    const { error } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", propertyId);

    if (error) {
      console.error("Error updating listing status:", error);
      alert("Something went wrong updating this listing. Please try again.");
      return;
    }

    setPendingListings((prev) => prev.filter((p) => p.id !== propertyId));

    logAction(newStatus === "active" ? "approve" : "reject", propertyId);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">
        Loading pending listings...
      </div>
    );
  }

  if (pendingListings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">
        No pending listings. All caught up.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-6">
        Pending Listings ({pendingListings.length})
      </h1>

      <div className="space-y-6">
        {pendingListings.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  <Link
                    to={`/admin/listings/${property.id}`}
                    className="hover:underline hover:text-brand-green-deep"
                  >
                    {property.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500">
                  {formatCategory(property.category)} ·{" "}
                  {property.villages?.name}
                </p>
              </div>
              <span className="text-brand-gold font-semibold">
                {formatPrice(property.price)}
              </span>
            </div>

            {property.description && (
              <p className="text-gray-700 text-sm mb-4">
                {property.description}
              </p>
            )}

            <p className="text-sm text-gray-600 mb-4">
              WhatsApp: {property.whatsapp_number}
            </p>

            {property.property_images && property.property_images.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto mb-4">
                {property.property_images.map((img, index) => (
                  <img
                    key={index}
                    src={img.storage_path}
                    alt={`Photo of ${property.title}`}
                    className="w-32 h-32 object-cover rounded-md border border-gray-200 flex-shrink-0"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No images uploaded</p>
            )}

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleReview(property.id, "active")}
                className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-deep transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleReview(property.id, "rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
