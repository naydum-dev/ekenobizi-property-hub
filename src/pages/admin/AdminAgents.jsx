import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { logAction } from "../../utils/auditLog";

export default function AdminAgents() {
  const [pendingAgents, setPendingAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docUrls, setDocUrls] = useState({});

  useEffect(() => {
    fetchPendingAgents();
  }, []);

  async function fetchPendingAgents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, business_name, business_doc_url, created_at",
      )
      .eq("agent_status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pending agent applications:", error);
      setLoading(false);
      return;
    }

    setPendingAgents(data);
    setLoading(false);

    // Generate a short-lived signed URL per document, since the bucket is private
    data.forEach(async (applicant) => {
      if (!applicant.business_doc_url) return;
      const { data: signedData, error: signedError } = await supabase.storage
        .from("agent-documents")
        .createSignedUrl(applicant.business_doc_url, 300); // 5 minutes

      if (!signedError && signedData?.signedUrl) {
        setDocUrls((prev) => ({
          ...prev,
          [applicant.id]: signedData.signedUrl,
        }));
      }
    });
  }

  async function handleReview(applicantId, decision) {
    if (decision === "rejected") {
      const confirmed = window.confirm(
        "Are you sure you want to reject this agent application?",
      );
      if (!confirmed) return;
    }

    const updates =
      decision === "approved"
        ? { agent_status: "approved", is_verified_agent: true }
        : { agent_status: "rejected", is_verified_agent: false };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", applicantId);

    if (error) {
      console.error("Error updating agent application:", error);
      alert(
        "Something went wrong updating this application. Please try again.",
      );
      return;
    }

    setPendingAgents((prev) => prev.filter((a) => a.id !== applicantId));

    logAction(
      decision === "approved" ? "approve_agent" : "reject_agent",
      applicantId,
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">
        Loading agent applications...
      </div>
    );
  }

  if (pendingAgents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">
        No pending agent applications. All caught up.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-brand-green-deep mb-6">
        Pending Agent Applications ({pendingAgents.length})
      </h1>

      <div className="space-y-6">
        {pendingAgents.map((applicant) => (
          <div
            key={applicant.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {applicant.business_name}
                </h2>
                <p className="text-sm text-gray-500">
                  {applicant.full_name} · {applicant.email}
                </p>
              </div>
            </div>

            {docUrls[applicant.id] ? (
              <a
                href={docUrls[applicant.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-brand-green hover:text-brand-green-deep hover:underline mb-4"
              >
                View business registration document
              </a>
            ) : (
              <p className="text-sm text-gray-400 mb-4">
                Loading document link...
              </p>
            )}

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleReview(applicant.id, "approved")}
                className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-deep transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleReview(applicant.id, "rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
