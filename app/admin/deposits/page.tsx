"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Deposit = {
  id: number;
  username: string;
  email: string;
  amount: number;
  method: string;
  transaction_code: string;
  status: string;
  created_at: string;
};

export default function AdminDepositsPage() {

  const [loading, setLoading] = useState(true);

  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadDeposits();
  }, []);

  async function loadDeposits() {

    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setDeposits(data as Deposit[]);
    }

    setLoading(false);

  }

  async function approveDeposit(deposit: Deposit) {

    const { data: userData, error } =
      await supabase
        .from("users")
        .select("balance")
        .eq("email", deposit.email)
        .single();

    if (error || !userData) {
      alert("User not found.");
      return;
    }

    const newBalance =
      Number(userData.balance || 0) +
      Number(deposit.amount);


      const { error: walletError } = await supabase
  .from("users")
  .update({
    balance: newBalance,
    fee_paid: true,
    is_activated: true,
  })
  .eq("email", deposit.email);

if (walletError) {
  alert(walletError.message);
  return;
}

  const { error: depositError } = await supabase
  .from("deposits")
  .update({
    status: "Approved",
  })
  .eq("id", deposit.id);

if (depositError) {
  alert(depositError.message);
  return;
}
   

    await loadDeposits();

   alert(
  "✅ Deposit approved.\n\nWallet updated.\nAccount activated successfully."
);

  }

  async function rejectDeposit(deposit: Deposit) {

    await supabase
      .from("deposits")
      .update({
        status: "Rejected",
      })
      .eq("id", deposit.id);

    await loadDeposits();

    alert("❌ Deposit Rejected");

  }

  const filteredDeposits = deposits.filter((deposit) => {

    const searchMatch =
      deposit.username
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      deposit.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      deposit.transaction_code
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const filterMatch =
      filter === "All" ||
      deposit.status === filter;

    return searchMatch && filterMatch;

  });

  const totalDeposits =
    deposits.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const pending =
    deposits.filter(
      (d) => d.status === "Pending"
    ).length;

  const approved =
    deposits.filter(
      (d) => d.status === "Approved"
    ).length;

  const rejected =
    deposits.filter(
      (d) => d.status === "Rejected"
    ).length;if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#020617",
          color: "white",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Loading Deposits...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#111827,#312e81)",
        padding: "30px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >

      <h1
        style={{
          fontSize: "38px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        💰 Deposit Management
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "30px",
        }}
      >
        Review, approve and reject customer deposits.
      </p>

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        <StatCard
          title="Total Deposits"
          value={`KES ${totalDeposits.toLocaleString()}`}
          color="#22c55e"
        />

        <StatCard
          title="Pending"
          value={pending}
          color="#facc15"
        />

        <StatCard
          title="Approved"
          value={approved}
          color="#38bdf8"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          color="#ef4444"
        />

      </div>

      {/* Search */}

      <input
        placeholder="🔍 Search username, email or transaction code..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #334155",
          background: "#0f172a",
          color: "white",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      {/* Filters */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {["All", "Pending", "Approved", "Rejected"].map((item) => (

          <button
            key={item}
            onClick={() => setFilter(item)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background:
                filter === item
                  ? "#2563eb"
                  : "#1e293b",
              color: "white",
            }}
          >
            {item}
          </button>

        ))}
      </div>{/* Deposits Table */}

      <div
        style={{
          background: "#0f172a",
          borderRadius: "20px",
          border: "1px solid #334155",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "white",
          }}
        >
          <thead
            style={{
              background: "#1e293b",
            }}
          >
            <tr>
              <th style={{ padding: "16px", textAlign: "left" }}>User</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Method</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Transaction Code</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "16px", textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredDeposits.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No deposits found.
                </td>

              </tr>

            ) : (

              filteredDeposits.map((deposit) => (

                <tr
                  key={deposit.id}
                  style={{
                    borderTop: "1px solid #334155",
                  }}
                >

                  <td style={{ padding: "16px" }}>
                    <strong>{deposit.username}</strong>

                    <br />

                    <small
                      style={{
                        color: "#94a3b8",
                      }}
                    >
                      {deposit.email}
                    </small>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "bold",
                      color: "#22c55e",
                    }}
                  >
                    KES {Number(deposit.amount).toLocaleString()}
                  </td>

                  <td style={{ padding: "16px" }}>
                    {deposit.method}
                  </td>

                  <td style={{ padding: "16px" }}>
                    {deposit.transaction_code}
                  </td>

                  <td style={{ padding: "16px" }}>
                    {new Date(
                      deposit.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td style={{ padding: "16px" }}>

                    <span
                      style={{
                        padding: "7px 14px",
                        borderRadius: "20px",
                        background:
                          deposit.status === "Approved"
                            ? "#16a34a"
                            : deposit.status === "Rejected"
                            ? "#dc2626"
                            : "#ca8a04",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      {deposit.status}
                    </span>

                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >

                    {deposit.status === "Pending" ? (

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >

                        <button
                          onClick={() =>
                            approveDeposit(deposit)
                          }
                          style={{
                            background: "#16a34a",
                            color: "white",
                            border: "none",
                            padding: "9px 14px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          ✅ Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectDeposit(deposit)
                          }
                          style={{
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "9px 14px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          ❌ Reject
                        </button>

                      </div>

                    ) : (

                      <span
                        style={{
                          color: "#94a3b8",
                        }}
                      >
                        Completed
                      </span>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div></main>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "18px",
        padding: "22px",
        boxShadow: "0 10px 25px rgba(0,0,0,.25)",
      }}
    >
      <h3
        style={{
          color: "#cbd5e1",
          margin: 0,
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color,
          marginTop: "12px",
          marginBottom: 0,
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        {value}
      </h1>
    </div>
  );
}