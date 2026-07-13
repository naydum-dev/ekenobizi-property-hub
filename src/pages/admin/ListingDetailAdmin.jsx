import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const CATEGORY_OPTIONS = [
  { value: "land_for_sale", label: "Land for Sale" },
  { value: "house_for_sale", label: "House for Sale" },
  { value: "house_for_rent", label: "House for Rent" },
  { value: "shop_for_rent", label: "Shop for Rent" },
];

function formatCategory(category) {
  const match = CATEGORY_OPTIONS.find((c) => c.value === category);
  return match ? match.label : category;
}

function formatPrice(price) {
  if (!price) return "Price on request";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ListingDetailAdmin() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    village_id: "",
    price: "",
    whatsapp_number: "",
  });

  useEffect(() => {
    fetchProperty();
    fetchVillages();
  }, [id]);

  async function fetchProperty() {
    setLoading(true);
    setNotFound(false);

    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        villages ( name ),
        property_images ( storage_path, is_primary ),
        profiles ( full_name, phone )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching property:", error);
      setNotFound(true);
      setLoading(false);
      return;
    }

    setProperty(data);
    setFormData({
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      village_id: data.village_id || "",
      price: data.price || "",
      whatsapp_number: data.whatsapp_number || "",
    });
    setLoading(false);
  }

  async function fetchVillages() {
    const { data, error } = await supabase
      .from("villages")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching villages:", error);
      return;
    }

    setVillages(data);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCancel() {
    // Reset form back to the last saved property values
    setFormData({
      title: property.title || "",
      description: property.description || "",
      category: property.category || "",
      village_id: property.village_id || "",
      price: property.price || "",
      whatsapp_number: property.whatsapp_number || "",
    });
    setIsEditing(false);
  }

  async function handleReview(newStatus) {
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
      .eq("id", id);

    if (error) {
      console.error("Error updating listing status:", error);
      alert("Something went wrong updating this listing. Please try again.");
      return;
    }

    fetchProperty();
  }

  async function handleSave() {
    setSaving(true);

    const updates = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      village_id: formData.village_id,
      price: formData.price === "" ? null : Number(formData.price),
      whatsapp_number: formData.whatsapp_number,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error("Error saving property:", error);
      alert("Something went wrong saving changes. Please try again.");
      return;
    }

    setIsEditing(false);
    fetchProperty();
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">
        Loading listing...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">
        Listing not found.{" "}
        <Link to="/admin" className="text-brand-green underline">
          Back to Review Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/admin"
        className="text-sm text-brand-green hover:underline mb-4 inline-block"
      >
        ← Back to Review Queue
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {/* Header row: title/status on the left, Edit toggle on the right */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-md px-2 py-1 w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                {property.title}
              </h1>
            )}
            {!isEditing && (
              <p className="text-sm text-gray-500 mt-1">
                {formatCategory(property.category)} · {property.villages?.name}
              </p>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-brand-green text-brand-green rounded-md hover:bg-brand-green hover:text-white transition"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 mb-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="village_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Village
              </label>
              <select
                id="village_id"
                name="village_id"
                value={formData.village_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="whatsapp_number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                WhatsApp Number
              </label>
              <input
                type="text"
                id="whatsapp_number"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-deep transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-brand-gold font-semibold text-lg mb-4">
              {formatPrice(property.price)}
            </p>

            {property.description && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Description
                </h2>
                <p className="text-gray-700 text-sm">{property.description}</p>
              </div>
            )}
          </>
        )}

        {/* Owner details — read-only always, not part of the edit form */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Owner Details
          </h2>
          <p className="text-sm text-gray-700">
            Name: {property.profiles?.full_name || "Unknown"}
          </p>
          <p className="text-sm text-gray-700">
            Phone: {property.profiles?.phone || "Not provided"}
          </p>
          <p className="text-sm text-gray-700">
            WhatsApp: {property.whatsapp_number}
          </p>
        </div>

        {/* Submission date */}
        <p className="text-sm text-gray-500 mb-4">
          Submitted: {formatDate(property.created_at)}
        </p>

        {/* Image gallery — always visible, not editable in this version */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Images</h2>
          {property.property_images && property.property_images.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto">
              {property.property_images.map((img, index) => (
                <img
                  key={index}
                  src={img.storage_path}
                  alt={`Photo of ${property.title}`}
                  className="w-40 h-40 object-cover rounded-md border border-gray-200 flex-shrink-0"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No images uploaded</p>
          )}
        </div>

        <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
          Status: {property.status}
        </p>

        {!isEditing && property.status === "pending" && (
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleReview("active")}
              className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-deep transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleReview("rejected")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
