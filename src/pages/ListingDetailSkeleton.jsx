import Skeleton from "../components/ui/Skeleton";

export default function ListingDetailSkeleton() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 animate-pulse"
      aria-hidden="true"
    >
      {/* Back link placeholder */}
      <Skeleton className="h-4 w-28 mb-6" />

      {/* Image Gallery */}
      <div className="mb-8">
        <Skeleton className="w-full h-72 md:h-96 mb-3" rounded="rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-shrink-0 w-20 h-20"
              rounded="rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left — main details */}
        <div className="md:col-span-2 space-y-5">
          {/* Badges */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28" rounded="rounded-full" />
            <Skeleton className="h-6 w-20" rounded="rounded-full" />
          </div>

          {/* Title */}
          <Skeleton className="h-8 w-3/4" />

          {/* Village */}
          <Skeleton className="h-4 w-1/2" />

          {/* Description */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Right — price + CTA card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-12 w-full" rounded="rounded-lg" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
