export default function AgentBadge({ businessName, size = "md" }) {
  if (!businessName) return null;

  const sizeClasses = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";

  return (
    <span
      title={`Listed by ${businessName}`}
      className={`inline-block max-w-full truncate bg-brand-green-deep text-white text-xs font-semibold rounded-full ${sizeClasses}`}
    >
      Listed by {businessName}
    </span>
  );
}
