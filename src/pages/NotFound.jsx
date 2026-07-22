import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-brand-green-deep mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          We couldn't find that page
        </h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for may have been moved, or the listing may no
          longer be available.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-brand-green text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-green-deep transition"
          >
            Go Home
          </Link>
          <Link
            to="/listings"
            className="border border-brand-green text-brand-green px-6 py-2.5 rounded-lg font-medium hover:bg-green-50 transition"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
