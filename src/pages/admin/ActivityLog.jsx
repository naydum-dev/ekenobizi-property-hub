import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const ACTION_LABELS = {
  approve: "approved",
  reject: "rejected",
  delete: "deleted",
};

const ACTION_COLORS = {
  approve: "text-brand-green",
  reject: "text-red-600",
  delete: "text-gray-500",
};

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ActivityLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLog();
  }, []);

  async function fetchLog() {
    setLoading(true);
    setError(null);

    const { data: logData, error: logError } = await supabase
      .from("audit_log")
      .select(
        `
        id,
        action,
        entity_id,
        created_at,
        profiles ( full_name )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (logError) {
      console.error("Error fetching activity log:", logError.message);
      setError("Failed to load activity log.");
      setLoading(false);
      return;
    }

    // entity_id has no foreign key to properties by design (audit_log is
    // meant to stay generic, and a hard FK would block or cascade-delete
    // the very log entries recording a delete). So we fetch titles
    // separately and merge them in here, rather than an embedded join.
    const propertyIds = [...new Set(logData.map((entry) => entry.entity_id))];

    const { data: propertiesData, error: propertiesError } = await supabase
      .from("properties")
      .select("id, title")
      .in("id", propertyIds);

    if (propertiesError) {
      console.error("Error fetching listing titles:", propertiesError.message);
      // Non-fatal: the feed can still render with "a deleted listing" fallbacks
    }

    const titleById = new Map(
      (propertiesData ?? []).map((p) => [p.id, p.title]),
    );

    const merged = logData.map((entry) => ({
      ...entry,
      listingTitle: titleById.get(entry.entity_id) ?? null,
    }));

    setEntries(merged);
    setLoading(false);
  }

  if (loading) {
    return <p className="p-6 text-brand-earth">Loading activity...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-1">
        Activity Log
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        A history of admin actions on listings. Most recent first.
      </p>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No activity recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => {
            // properties row may be null if the listing was later deleted
            const listingTitle = entry.listingTitle ?? "a deleted listing";
            const adminName = entry.profiles?.full_name ?? "An admin";

            return (
              <li
                key={entry.id}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-start justify-between gap-4"
              >
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{adminName}</span>{" "}
                  <span className={ACTION_COLORS[entry.action]}>
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </span>{" "}
                  {entry.listingTitle ? (
                    <Link
                      to={`/admin/listings/${entry.entity_id}`}
                      className="font-medium text-brand-green hover:underline"
                    >
                      "{listingTitle}"
                    </Link>
                  ) : (
                    <span className="italic text-gray-500">
                      "{listingTitle}"
                    </span>
                  )}
                </p>
                <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
                  {formatRelativeTime(entry.created_at)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
