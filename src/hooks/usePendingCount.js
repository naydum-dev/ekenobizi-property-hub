import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Returns the current count of pending listings.
 * Fetches once on mount. Step 5 will extend this same hook with a
 * Supabase Realtime subscription so the count updates live — every
 * component calling this hook will get that upgrade for free once added.
 */
export function usePendingCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCount();

    // Re-fetch the count whenever properties changes in a way that could
    // affect the pending count: new submissions (INSERT, always start
    // pending) or status changes via approve/reject (UPDATE). Re-running
    // the same count query on any relevant event is simpler and safer
    // than trying to patch the number in JS from the change payload.
    const channel = supabase
      .channel("pending-count-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "properties" },
        () => fetchCount(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "properties" },
        () => fetchCount(),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "properties" },
        () => fetchCount(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchCount() {
    const { count, error } = await supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching pending count:", error.message);
      setLoading(false);
      return;
    }

    setCount(count ?? 0);
    setLoading(false);
  }

  return { count, loading };
}
