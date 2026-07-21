"use client";

import { useEffect, useState } from "react";

export default function DailyRewardPage() {
  const [canClaim, setCanClaim] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user =
      localStorage.getItem("currentUser") || "";

    const lastClaim =
      localStorage.getItem(
        `lastClaim_${user}`
      );

    if (!lastClaim) {
      setCanClaim(true);
      return;
    }

    const difference =
      Date.now() - Number(lastClaim);

    if (difference >= 24 * 60 * 60 * 1000) {
      setCanClaim(true);
    }
  }, []);

  const claimReward = () => {
    const user =
      localStorage.getItem("currentUser") || "";

    const balance =
      Number(
        localStorage.getItem(
          `balance_${user}`
        )
      ) || 0;

    localStorage.setItem(
      `balance_${user}`,
      (balance + 10).toString()
    );

    localStorage.setItem(
      `lastClaim_${user}`,
      Date.now().toString()
    );

    // Save transaction history
    const transactions = JSON.parse(
      localStorage.getItem(
        `transactions_${user}`
      ) || "[]"
    );

    transactions.unshift({
      description:
        "🎁 Daily Reward",
      amount: 10,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      `transactions_${user}`,
      JSON.stringify(transactions)
    );

    // Save notification
    const notifications = JSON.parse(
      localStorage.getItem(
        `notifications_${user}`
      ) || "[]"
    );

    notifications.unshift({
      message:
        "🎁 Daily Reward Claimed (+KES 10)",
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      `notifications_${user}`,
      JSON.stringify(notifications)
    );

    setCanClaim(false);

    setMessage(
      "✅ Daily reward claimed. KES 10 added."
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
      <h1>🎁 Daily Reward</h1>

      {canClaim ? (
        <button
          onClick={claimReward}
          style={{
            padding: "12px 25px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          Claim KES 10
        </button>
      ) : (
        <p>
          Daily reward already claimed.
          Come back tomorrow.
        </p>
      )}

      <p style={{ marginTop: "20px" }}>
        {message}
      </p>
    </main>
  );
}