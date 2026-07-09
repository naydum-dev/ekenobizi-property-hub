import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function StatCard({ label, value, loading }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 min-w-[120px]">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-brand-green-deep">
        {loading ? "—" : value}
      </p>
    </div>
  );
}

function StatsBar() {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);

      const [totalRes, pendingRes, verifiedRes, rejectedRes] =
        await Promise.all([
          supabase
            .from("properties")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("is_verified", true),
          supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("status", "rejected"),
        ]);

      setCounts({
        total: totalRes.count ?? 0,
        pending: pendingRes.count ?? 0,
        verified: verifiedRes.count ?? 0,
        rejected: rejectedRes.count ?? 0,
      });
      setLoading(false);
    }

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <StatCard label="Total Listings" value={counts.total} loading={loading} />
      <StatCard
        label="Pending Review"
        value={counts.pending}
        loading={loading}
      />
      <StatCard label="Verified" value={counts.verified} loading={loading} />
      <StatCard label="Rejected" value={counts.rejected} loading={loading} />
    </div>
  );
}

export default StatsBar;
