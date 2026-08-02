"use client";

import { useEffect, useState } from "react";

type DailyRewardProps = {
  username: string;
};

export default function DailyReward({
  username,
}: DailyRewardProps) {
  const REWARD = 50;

  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();

    const lastClaim =
      localStorage.getItem(`dailyReward_${username}`);

    if (lastClaim === today) {
      setClaimedToday(true);
    }
  }, [username]);

  function claimReward() {
    if (claimedToday) {
      alert("⏳ You have already claimed today's reward.");
      return;
    }

    const today = new Date().toDateString();

    localStorage.setItem(
      `dailyReward_${username}`,
      today
    );

    const balance =
      Number(localStorage.getItem(`balance_${username}`)) || 0;

    localStorage.setItem(
      `balance_${username}`,
      (balance + REWARD).toString()
    );

    const transactions = JSON.parse(
      localStorage.getItem(`transactions_${username}`) || "[]"
    );

    transactions.unshift({
      type: "Daily Reward",
      amount: REWARD,
      status: "Completed",
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      `transactions_${username}`,
      JSON.stringify(transactions)
    );

    const notifications = JSON.parse(
      localStorage.getItem(`notifications_${username}`) || "[]"
    );

    notifications.unshift({
      title: "🎉 Daily Reward",
      message: `You received KES ${REWARD} daily reward.`,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      `notifications_${username}`,
      JSON.stringify(notifications)
    );

    setClaimedToday(true);

    alert(`🎁 You received KES ${REWARD}!`);

    window.location.reload();
  }

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "20px",
        marginTop: "24px",
        boxShadow: "0 8px 20px rgba(0,0,0,.2)",
      }}
    >
      <h2 style={{ color: "white" }}>
        🎁 Daily Reward
      </h2>

      <p style={{ color: "#94a3b8" }}>
        Claim your reward once every day.
      </p>

      <h1
        style={{
          color: "#22c55e",
          marginTop: "12px",
        }}
      >
        KES {REWARD}
      </h1>

      <button
        onClick={claimReward}
        disabled={claimedToday}
        style={{
          width: "100%",
          marginTop: "18px",
          padding: "14px",
          border: "none",
          borderRadius: "12px",
          background: claimedToday ? "#6b7280" : "#2563eb",
          color: "white",
          cursor: claimedToday ? "default" : "pointer",
          fontWeight: "bold",
        }}
      >
        {claimedToday
          ? "✅ Claimed Today"
          : "🎁 Claim Reward"}
      </button>
    </div>
  );
}