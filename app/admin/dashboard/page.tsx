"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);

  useEffect(() => {
    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    setTotalUsers(users.length);

    setEarnings(
      Number(
        localStorage.getItem("adminEarnings")
      ) || 0
    );

    const withdrawals = JSON.parse(
      localStorage.getItem(
        "withdrawRequests"
      ) || "[]"
    );

    setTotalWithdrawals(withdrawals.length);

    const results = JSON.parse(
      localStorage.getItem(
        "challengeResults"
      ) || "[]"
    );

    setTotalChallenges(results.length);

    let refs = 0;

    users.forEach((user: any) => {
      refs +=
        Number(
          localStorage.getItem(
            `referrals_${user.username}`
          )
        ) || 0;
    });

    setTotalReferrals(refs);
  }, []);

  const cardStyle = {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    minWidth: "220px",
    textAlign: "center" as const,
  };

  const buttonStyle = {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>👑 Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <div style={cardStyle}>
          <h3>👥 Total Users</h3>
          <h2>{totalUsers}</h2>
        </div>

        <div style={cardStyle}>
          <h3>💰 Admin Earnings</h3>
          <h2>KES {earnings}</h2>
        </div>

        <div style={cardStyle}>
          <h3>💸 Withdrawals</h3>
          <h2>{totalWithdrawals}</h2>
        </div>

        <div style={cardStyle}>
          <h3>🔗 Referrals</h3>
          <h2>{totalReferrals}</h2>
        </div>

        <div style={cardStyle}>
          <h3>🧠 Challenges</h3>
          <h2>{totalChallenges}</h2>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            (window.location.href =
              "/admin/payments")
          }
          style={{
            ...buttonStyle,
            background: "#16a34a",
          }}
        >
          💳 Payments
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/admin/withdrawals")
          }
          style={{
            ...buttonStyle,
            background: "#dc2626",
          }}
        >
          💸 Withdrawals
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/admin/results")
          }
          style={{
            ...buttonStyle,
            background: "#7c3aed",
          }}
        >
          📊 Results
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/leaderboard")
          }
          style={{
            ...buttonStyle,
            background: "#f59e0b",
          }}
        >
          🏅 Leaderboard
        </button>
      </div>
    </main>
  );
}