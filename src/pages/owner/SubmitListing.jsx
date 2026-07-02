import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) {
      return;
    }

    console.log("Form is valid. Data:", formData);
    // Supabase insert comes in a later step, after image upload is built
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-brand-green text-white font-semibold py-3 rounded-lg hover:bg-brand-green-deep transition-colors"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
};

export default SubmitListing;
