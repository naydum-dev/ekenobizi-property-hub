import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  { value: "land_for_sale", label: "Land for Sale" },
  { value: "house_for_sale", label: "House for Sale" },
  { value: "house_for_rent", label: "House for Rent" },
  { value: "shop_for_rent", label: "Shop for Rent" },
];

export default function EditListing() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    village_id: "",
    price: "",
    whatsapp_number: "",
  });
  const [villages, setVillages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notEditable, setNotEditable] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchVillages();
    if (user) fetchProperty();
  }, [user]);

  async function fetchVillages() {
    const { data, error } = await supabase
      .from("villages")
      .select("id, name")
      .order("name");
    if (!error) setVillages(data);
  }

  async function fetchProperty() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (data.status !== "pending") {
      setNotEditable(true);
      setLoading(false);
      return;
    }

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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.village_id) newErrors.village_id = "Village is required";
    if (!formData.whatsapp_number.trim())
      newErrors.whatsapp_number = "WhatsApp number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const { error } = await supabase
      .from("properties")
      .update({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        village_id: formData.village_id,
        price: formData.price || null,
        whatsapp_number: formData.whatsapp_number,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSubmitting(false);

    if (error) {
      console.error("Error updating listing:", error);
      alert("Something went wrong updating your listing. Please try again.");
      return;
    }

    alert("Listing updated successfully.");
    navigate("/owner");
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading listing...</div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6 text-center text-gray-500">
        Listing not found, or you don't have permission to edit it.
      </div>
    );
  }

  if (notEditable) {
    return (
      <div className="p-6 text-center text-gray-500">
        This listing is no longer editable because it has already been reviewed.
        Contact the admin if changes are needed.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-6">
        Edit Listing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
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
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category}</p>
          )}
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
            <option value="">Select village</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          {errors.village_id && (
            <p className="text-red-600 text-sm mt-1">{errors.village_id}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price (optional)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            inputMode="numeric"
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
            id="whatsapp_number"
            name="whatsapp_number"
            type="text"
            value={formData.whatsapp_number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.whatsapp_number && (
            <p className="text-red-600 text-sm mt-1">
              {errors.whatsapp_number}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-green text-white rounded-md py-2 font-medium hover:bg-brand-green-deep transition disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
