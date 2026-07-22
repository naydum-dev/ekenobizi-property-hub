import { Link } from "react-router-dom";

export default function EmptyState({
  icon = "🏡",
  title,
  message,
  ctaLabel,
  ctaTo,
  onCtaClick,
}) {
  return (
    <div className="text-center py-20 px-4">
      <p className="text-3xl mb-3">{icon}</p>
      <p className="text-gray-700 font-semibold text-lg">{title}</p>
      {message && (
        <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">{message}</p>
      )}
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="inline-block mt-5 bg-brand-green text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-green-deep transition"
        >
          {ctaLabel}
        </Link>
      )}
      {ctaLabel && onCtaClick && !ctaTo && (
        <button
          onClick={onCtaClick}
          className="inline-block mt-5 bg-brand-green text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-green-deep transition"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
