"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [referrals, setReferrals] = useState(0);

  useEffect(() => {
    const user =
      localStorage.getItem("currentUser") || "";

    setUsername(user);

    const savedBalance =
      Number(
        localStorage.getItem(
          `balance_${user}`
        )
      ) || 0;

    setBalance(savedBalance);

    const results = JSON.parse(
      localStorage.getItem(
        "challengeResults"
      ) || "[]"
    );

    const userResults = results.filter(
      (item: any) =>
        item.username === user
    );

    setWins(
      userResults.filter(
        (item: any) =>
          item.result === "PASS"
      ).length
    );

    setLosses(
      userResults.filter(
        (item: any) =>
          item.result === "FAIL"
      ).length
    );

    const savedReferrals =
      Number(
        localStorage.getItem(
          `referrals_${user}`
        )
      ) || 0;

    setReferrals(savedReferrals);
  }, []);

  const copyReferralLink = () => {
    const link =
      `${window.location.origin}/register?ref=${username}`;

    navigator.clipboard.writeText(link);

    alert(
      "Referral link copied successfully!"
    );
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
      <h1>👤 Profile</h1>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        <h2>Username</h2>
        <p>{username}</p>
      </div>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "15px",
        }}
      >
        <h2>💰 Balance</h2>
        <p>KES {balance}</p>
      </div>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "15px",
        }}
      >
        <h2>🏆 Challenges Won</h2>
        <p>{wins}</p>
      </div>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "15px",
        }}
      >
        <h2>❌ Challenges Lost</h2>
        <p>{losses}</p>
      </div>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "15px",
        }}
      >
        <h2>👥 Referrals</h2>
        <p>{referrals}</p>

        <button
          onClick={copyReferralLink}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          🔗 Copy Referral Link
        </button>
      </div>

      <button
        onClick={() =>
          (window.location.href = "/")
        }
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Back to Dashboard
      </button>
    </main>
  );
}