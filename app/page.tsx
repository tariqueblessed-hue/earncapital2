"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const currentUser =
      localStorage.getItem("currentUser") || "";

    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);

    const savedBalance =
      Number(
        localStorage.getItem(
          `balance_${currentUser}`
        )
      ) || 0;

    setBalance(savedBalance);
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>🚀 Earn Capital Dashboard</h1>

      <h2>Welcome, {user}</h2>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h2>💰 Balance</h2>
        <h1>KES {balance}</h1>
      </div>

      <div
        style={{
          marginTop: "25px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <button
          onClick={() =>
            (window.location.href =
              "/profile")
          }
        >
          👤 Profile
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/challenge")
          }
        >
          🧠 Challenge
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/withdrawals")
          }
        >
          💸 Withdrawals
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/history")
          }
        >
          📜 History
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/daily-reward")
          }
        >
          🎁 Daily Reward
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/notifications")
          }
        >
          🔔 Notifications
        </button>

        <button
          onClick={logout}
          style={{
            background: "#dc2626",
            color: "white",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}