import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function formatPrice(price) {
  if (!price) return "Price on request";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCategory(category) {
  const map = {
    land_for_sale: "Land for Sale",
    house_for_sale: "House for Sale",
    house_for_rent: "House for Rent",
    shop_for_rent: "Shop for Rent",
  };
  return map[category] || category;
}

export default function ListingDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchProperty() {
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          *,
          villages ( name ),
          property_images ( id, storage_path, is_primary )
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        setError("Property not found.");
      } else {
        setProperty(data);
        // Set primary image as selected, fallback to first image
        const primary = data.property_images?.find((img) => img.is_primary);
        const first = data.property_images?.[0];
        setSelectedImage(primary || first || null);
      }
      setLoading(false);
    }

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading property...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/listings" className="text-brand-green hover:underline">
          ← Back to listings
        </Link>
      </div>
    );
  }

  const images = property.property_images || [];
  const whatsappMessage = encodeURIComponent(
    `Hello, I found your listing on Ekenobizi Property Hub and I'm interested in: ${property.title}`,
  );
  const whatsappUrl = `https://wa.me/${property.whatsapp_number}?text=${whatsappMessage}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/listings"
        className="inline-flex items-center gap-1 text-brand-green hover:text-brand-green-deep text-sm font-medium mb-6"
      >
        ← Back to listings
      </Link>

      {/* Image Gallery */}
      <div className="mb-8">
        {/* Main image */}
        <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden bg-gray-100 mb-3">
          {selectedImage ? (
            <img
              src={selectedImage.storage_path}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No images available
            </div>
          )}
        </div>

        {/* Thumbnails — only shown when there are multiple images */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage?.id === img.id
                    ? "border-brand-gold"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={img.storage_path}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left — main details */}
        <div className="md:col-span-2 space-y-5">
          {/* Category badge + verification badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-brand-gold text-white text-xs font-semibold px-3 py-1 rounded-full">
              {formatCategory(property.category)}
            </span>
            {property.is_verified && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                ✓ Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-brand-green-deep leading-snug">
            {property.title}
          </h1>

          {/* Village */}
          <p className="text-gray-500 text-sm flex items-center gap-1">
            📍 {property.villages?.name}, Ekenobizi Community
          </p>

          {/* Description */}
          {property.description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                About this property
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          )}
        </div>

        {/* Right — price + CTA card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24 space-y-5">
            {/* Price */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Price
              </p>
              <p className="text-2xl font-bold text-brand-green-deep">
                {formatPrice(property.price)}
              </p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.571a.75.75 0 0 0 .921.921l5.726-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.498-5.254-1.37l-.372-.214-3.853.99.99-3.853-.214-.372A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Contact on WhatsApp
            </a>

            {/* Trust note */}
            <p className="text-xs text-gray-400 text-center">
              This listing has been reviewed by the Ekenobizi Property Hub team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
