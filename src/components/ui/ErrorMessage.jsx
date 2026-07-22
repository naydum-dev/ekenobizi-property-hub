export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
  onRetry,
}) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-3xl mb-3">⚠️</p>
      <p className="text-gray-700 font-semibold text-lg">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 bg-brand-green text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-green-deep transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
