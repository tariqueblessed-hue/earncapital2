"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Withdrawal = {
  id: number;
  username: string;
  amount: number;
  method: string;
  account: string;
  status: string;
  created_at: string;
};

export default function AdminWithdrawalsPage() {
  const [loading, setLoading] = useState(true);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const pendingCount = withdrawals.filter(
    (w) => w.status === "Pending"
  ).length;

  const approvedCount = withdrawals.filter(
    (w) => w.status === "Approved"
  ).length;

  const rejectedCount = withdrawals.filter(
    (w) => w.status === "Rejected"
  ).length;

  const totalAmount = withdrawals.reduce(
    (sum, w) => sum + Number(w.amount),
    0
  );

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function loadWithdrawals() {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setWithdrawals(data as Withdrawal[]);
    }

    setLoading(false);
  }

  async function approveWithdrawal(id: number) {
    const withdrawal = withdrawals.find(
      (w) => w.id === id
    );

    if (!withdrawal) return;

    const { data: user } = await supabase
      .from("users")
      .select("balance")
      .eq("username", withdrawal.username)
      .single();

    if (!user) {
      alert("User not found.");
      return;
    }

    const newBalance =
      Number(user.balance) -
      Number(withdrawal.amount);

    const { error: balanceError } =
      await supabase
        .from("users")
        .update({
          balance: newBalance,
        })
        .eq("username", withdrawal.username);

    if (balanceError) {
      alert(balanceError.message);
      return;
    }

    const { error } = await supabase
      .from("withdrawals")
      .update({
        status: "Approved",
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Withdrawal Approved");

    loadWithdrawals();
  }

  async function rejectWithdrawal(id: number) {
    const { error } = await supabase
      .from("withdrawals")
      .update({
        status: "Rejected",
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("❌ Withdrawal Rejected");

    loadWithdrawals();
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#020617",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "24px",
        }}
      >
        Loading Withdrawals...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "30px",
      }}
    ><h1
        style={{
          fontSize: "40px",
          fontWeight: "800",
          marginBottom: "10px",
        }}
      >
        💸 Withdrawal Requests
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "30px",
        }}
      >
        Review, approve or reject withdrawal requests.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        <SummaryCard
          title="Pending"
          value={pendingCount.toString()}
          color="#facc15"
        />

        <SummaryCard
          title="Approved"
          value={approvedCount.toString()}
          color="#22c55e"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedCount.toString()}
          color="#ef4444"
        />

        <SummaryCard
          title="Total Amount"
          value={`KES ${totalAmount.toLocaleString()}`}
          color="#3b82f6"
        />
      </div>

      {withdrawals.length === 0 ? (
        <div
          style={{
            background: "#111827",
            borderRadius: "18px",
            padding: "40px",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          No withdrawal requests found.
        </div>
      ) : (
        withdrawals.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#111827",
              border: "1px solid #334155",
              borderRadius: "18px",
              padding: "22px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>
              👤 {item.username}
            </h2>

            <p>
              <strong>Amount:</strong> KES{" "}
              {Number(item.amount).toLocaleString()}
            </p>

            <p>
              <strong>Method:</strong> {item.method}
            </p>

            <p>
              <strong>Account:</strong> {item.account}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    item.status === "Approved"
                      ? "#22c55e"
                      : item.status === "Rejected"
                      ? "#ef4444"
                      : "#facc15",
                  fontWeight: "bold",
                }}
              >
                {item.status}
              </span>
            </p>

            <p
              style={{
                color: "#94a3b8",
                marginBottom: "20px",
              }}
            >
              {new Date(item.created_at).toLocaleString()}
            </p>

            {item.status === "Pending" && (
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                }}
              >
                <button
                  onClick={() => approveWithdrawal(item.id)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "700",
                  }}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => rejectWithdrawal(item.id)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "700",
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}</main>
  );
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "22px",
        border: `2px solid ${color}`,
        boxShadow: "0 10px 25px rgba(0,0,0,.25)",
      }}
    >
      <h3
        style={{
          color: "#94a3b8",
          marginBottom: "12px",
          fontSize: "16px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color,
          fontSize: "32px",
          fontWeight: "800",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}