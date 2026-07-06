import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ImageUpload from "../../components/owner/ImageUpload";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  { value: "land_for_sale", label: "Land for Sale" },
  { value: "house_for_sale", label: "House for Sale" },
  { value: "house_for_rent", label: "House for Rent" },
  { value: "shop_for_rent", label: "Shop for Rent" },
];

const SubmitListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    village_id: "",
    price: "",
    whatsapp_number: "",
  });

  const [errors, setErrors] = useState({});
  const [villages, setVillages] = useState([]);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // clear error for this field as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.village_id) {
      newErrors.village_id = "Please select a village";
    }

    if (formData.price.trim() !== "") {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = "Price must be a positive number";
      }
    }

    const whatsapp = formData.whatsapp_number.trim();
    if (!whatsapp) {
      newErrors.whatsapp_number = "WhatsApp number is required";
    } else if (!/^\d{10,15}$/.test(whatsapp)) {
      newErrors.whatsapp_number =
        "Enter a valid number (digits only, 10-15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file, propertyId) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${propertyId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) {
      return;
    }

    if (images.length === 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Please add at least one image",
      }));
      return;
    }

    setSubmitting(true);

    try {
      // 1. Insert the property row first
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          owner_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          village_id: formData.village_id,
          price: formData.price.trim() ? Number(formData.price) : null,
          whatsapp_number: formData.whatsapp_number.trim(),
        })
        .select()
        .single();

      if (propertyError) {
        throw new Error(`Could not create listing: ${propertyError.message}`);
      }

      // 2. Upload each image, then insert its row into property_images
      for (const img of images) {
        const publicUrl = await uploadImage(img.file, property.id);

        const { error: imageRowError } = await supabase
          .from("property_images")
          .insert({
            property_id: property.id,
            storage_path: publicUrl,
            is_primary: img.isPrimary || false,
          });

        if (imageRowError) {
          throw new Error(`Could not save image: ${imageRowError.message}`);
        }
      }

      // 3. Success — reset and redirect
      alert("Listing submitted! It will go live after admin review.");
      navigate("/owner");
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchVillages = async () => {
      const { data, error } = await supabase
        .from("villages")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error fetching villages:", error);
        return;
      }

      setVillages(data);
    };

    fetchVillages();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-6">
        Submit a Listing
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Listing Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. 3 Bedroom House for Rent in Dikeukwu"
            className={`w-full py-3 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add any extra details about the property..."
            className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Category */}
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
            className={`w-full py-3 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a category</option>
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

        {/* Village */}
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
            className={`w-full py-3 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green ${
              errors.village_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a village</option>
            {villages.map((village) => (
              <option key={village.id} value={village.id}>
                {village.name}
              </option>
            ))}
          </select>
          {errors.village_id && (
            <p className="text-red-600 text-sm mt-1">{errors.village_id}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price (₦){" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 150000"
            inputMode="numeric"
            className={`w-full py-3 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* WhatsApp Number */}
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
            placeholder="e.g. 2348012345678"
            inputMode="numeric"
            className={`w-full py-3 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green ${
              errors.whatsapp_number ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.whatsapp_number && (
            <p className="text-red-600 text-sm mt-1">
              {errors.whatsapp_number}
            </p>
          )}
        </div>

        {/* Images */}
        <ImageUpload
          images={images}
          setImages={setImages}
          error={errors.images}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-green text-white font-semibold py-3 rounded-lg hover:bg-brand-green-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
};

export default SubmitListing;
