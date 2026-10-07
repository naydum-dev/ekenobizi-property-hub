import { supabase } from "./supabase";

// Takes an array of properties (each must include `owner_id`) and returns
// the same properties with `agent_business_name` attached.
// The value is null when the owner is not an approved agent.
// Reads from the public_agent_profiles view (id + business_name only).
export async function attachAgentInfo(properties) {
  const ownerIds = [
    ...new Set(properties.map((p) => p.owner_id).filter(Boolean)),
  ];
  if (ownerIds.length === 0) return properties;

  const { data, error } = await supabase
    .from("public_agent_profiles")
    .select("id, business_name")
    .in("id", ownerIds);

  // Fail soft: if the lookup fails, show listings without the agent badge
  if (error || !data) return properties;

  const businessNameById = new Map(data.map((a) => [a.id, a.business_name]));

  return properties.map((p) => ({
    ...p,
    agent_business_name: businessNameById.get(p.owner_id) || null,
  }));
}
