"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Request = {
  id: number;
  user_id: string;
  email: string;
  transaction_code: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function ActivationRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data, error } = await supabase
      .from("activation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data as Request[]);
    }

    setLoading(false);
  }

  async function approve(request: Request) {
    // Activate user
    const { error: userError } = await supabase
      .from("users")
      .update({
        is_activated: true,
      })
      .eq("id", request.user_id);

    if (userError) {
      alert(userError.message);
      return;
    }

    // Update request
    await supabase
      .from("activation_requests")
      .update({
        status: "Approved",
      })
      .eq("id", request.id);

    alert("✅ Account activated successfully.");

    loadRequests();
  }

  async function reject(request: Request) {
    await supabase
      .from("activation_requests")
      .update({
        status: "Rejected",
      })
      .eq("id", request.id);

    alert("❌ Activation rejected.");

    loadRequests();
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          padding: "30px",
        }}
      >
        Loading...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "25px",
      }}
    >
      <h1>🔐 Activation Requests</h1>

      {requests.length === 0 ? (
        <p>No activation requests.</p>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "15px",
              marginTop: "20px",
            }}
          >
            <h2>{request.email}</h2>

            <p>💰 Amount: KES {request.amount}</p>

            <p>
              🧾 Transaction Code:
              {" "}
              {request.transaction_code}
            </p>

            <p>
              📅
              {" "}
              {new Date(
                request.created_at
              ).toLocaleString()}
            </p>

            <p>
              Status:
              {" "}
              <strong>{request.status}</strong>
            </p>

            {request.status === "Pending" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() => approve(request)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#16a34a",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => reject(request)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#dc2626",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </main>
  );
}