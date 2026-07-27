import { Link } from "react-router-dom";
import VerifiedBadge from "../ui/VerifiedBadge";

const CATEGORY_LABELS = {
  land_for_sale: "Land for Sale",
  house_for_sale: "House for Sale",
  house_for_rent: "House for Rent",
  shop_for_rent: "Shop for Rent",
};

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    category,
    price,
    whatsapp_number,
    villages,
    property_images,
    is_verified,
  } = property;

  const primaryImage =
    property_images?.find((img) => img.is_primary) || property_images?.[0];
  const categoryLabel = CATEGORY_LABELS[category] || category;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <Link to={`/listings/${id}`}>
        <div className="h-48 bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.storage_path}
              alt={`Photo of ${title}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category + Verified badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block text-xs font-semibold text-brand-gold uppercase tracking-wide">
            {categoryLabel}
          </span>
          {is_verified && <VerifiedBadge size="sm" />}
        </div>

        {/* Title */}
        <Link to={`/listings/${id}`}>
          <h3 className="text-brand-green-deep font-semibold text-base leading-snug hover:underline">
            {title}
          </h3>
        </Link>

        {/* Village */}
        <p className="text-gray-500 text-sm">{villages?.name || "Ekenobizi"}</p>

        {/* Price */}
        {price && (
          <p className="text-brand-earth font-semibold text-sm">
            {Number(price).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </p>
        )}

        {/* CTA */}
        <a
          href={`https://wa.me/${whatsapp_number}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Contact seller on WhatsApp about ${title}`}
          className="mt-2 block w-full text-center bg-brand-green text-white text-sm font-semibold py-2 rounded-lg hover:bg-brand-green-deep transition-colors duration-200"
        >
          Contact on WhatsApp
        </a>
      </div>
    </div>
  );
}
