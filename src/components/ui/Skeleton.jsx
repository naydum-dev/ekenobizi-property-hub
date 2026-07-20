/**
 * Reusable skeleton primitive.
 *
 * Usage:
 *   <Skeleton className="h-4 w-1/3" />          → a text-line placeholder
 *   <Skeleton className="h-48 w-full" rounded="rounded-xl" /> → an image placeholder
 *
 * Renders a single gray block. Parent should wrap groups of these in
 * one `animate-pulse` container (not per-Skeleton) so the pulse stays
 * in sync — see PropertyCardSkeleton.jsx for the pattern.
 */
export default function Skeleton({ className = "", rounded = "rounded" }) {
  return <div className={`bg-gray-200 ${rounded} ${className}`} />;
}
