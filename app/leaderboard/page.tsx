"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const leaderboard = users.map((user: any) => {
      const balance =
        Number(
          localStorage.getItem(
            `balance_${user.username}`
          )
        ) || 0;

      const referrals =
        Number(
          localStorage.getItem(
            `referrals_${user.username}`
          )
        ) || 0;

      const results = JSON.parse(
        localStorage.getItem(
          "challengeResults"
        ) || "[]"
      );

      const wins = results.filter(
        (item: any) =>
          item.username === user.username &&
          item.result === "PASS"
      ).length;

      return {
        username: user.username,
        balance,
        referrals,
        wins,
      };
    });

    leaderboard.sort(
      (a: any, b: any) =>
        b.balance - a.balance
    );

    setLeaders(leaderboard);
  }, []);

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
      <h1>🏅 Leaderboard</h1>

      {leaders.length === 0 ? (
        <p>No users found</p>
      ) : (
        leaders.map((user, index) => (
          <div
            key={index}
            style={{
              background: "#1f2937",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            <h3>
              #{index + 1} 👤 {user.username}
            </h3>

            <p>
              💰 Balance: KES {user.balance}
            </p>

            <p>
              🔗 Referrals: {user.referrals}
            </p>

            <p>
              🏆 Wins: {user.wins}
            </p>
          </div>
        ))
      )}

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