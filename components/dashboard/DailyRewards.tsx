"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DailyRewardProps = {
username: string;
};

export default function DailyReward({
username,
}: DailyRewardProps) {
const REWARD = 50;

const [claimedToday, setClaimedToday] = useState(false);
const [loading, setLoading] = useState(false);

useEffect(() => {
const today = new Date().toDateString();

const lastClaim = localStorage.getItem(
  `dailyReward_${username}`
);

if (lastClaim === today) {
  setClaimedToday(true);
}

}, [username]);

async function claimReward() {
if (claimedToday || loading) {
return;
}

setLoading(true);

try {
  const today = new Date().toDateString();

  const lastClaim = localStorage.getItem(
    `dailyReward_${username}`
  );

  if (lastClaim === today) {
    setClaimedToday(true);
    setLoading(false);
    return;
  }

  // Get currently logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    alert("❌ Your session has expired. Please log in again.");
    setLoading(false);
    return;
  }

  // Get current balance from Supabase
  const { data: profile, error: profileError } =
    await supabase
      .from("users")
      .select("balance")
      .eq("email", user.email)
      .single();

  if (profileError || !profile) {
    console.error(profileError);
    alert("❌ Unable to load your wallet balance.");
    setLoading(false);
    return;
  }

  const currentBalance = Number(profile.balance || 0);
  const newBalance = currentBalance + REWARD;

  // Update the real wallet balance in Supabase
  const { error: balanceError } = await supabase
    .from("users")
    .update({
      balance: newBalance,
    })
    .eq("email", user.email);

  if (balanceError) {
    console.error(balanceError);
    alert("❌ Reward could not be added to your wallet.");
    setLoading(false);
    return;
  }

  // Keep localStorage balance synchronized
  localStorage.setItem(
    `balance_${username}`,
    newBalance.toString()
  );

  // Save daily claim date
  localStorage.setItem(
    `dailyReward_${username}`,
    today
  );

  // Save transaction history
  const transactions = JSON.parse(
    localStorage.getItem(
      `transactions_${username}`
    ) || "[]"
  );

  transactions.unshift({
    type: "Daily Reward",
    amount: REWARD,
    status: "Completed",
    date: new Date().toLocaleString(),
    created_at: new Date().toISOString(),
  });

  localStorage.setItem(
    `transactions_${username}`,
    JSON.stringify(transactions)
  );

  // Save notification
  const notifications = JSON.parse(
    localStorage.getItem(
      `notifications_${username}`
    ) || "[]"
  );

  notifications.unshift({
    title: "🎁 Daily Reward",
    message: `You received KES ${REWARD} daily reward.`,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem(
    `notifications_${username}`,
    JSON.stringify(notifications)
  );

  setClaimedToday(true);

  alert(
    `🎉 Daily Reward Claimed!\n\nKES ${REWARD} has been added to your wallet.`
  );

  // Refresh dashboard so WalletCard immediately
  // reads the updated Supabase balance.
  window.location.reload();
} catch (error) {
  console.error(error);
  alert("❌ Something went wrong while claiming your reward.");
}

setLoading(false);

}

return (
<div
style={{
background:
"linear-gradient(135deg,#111827,#1e293b)",
borderRadius: "18px",
padding: "20px",
marginTop: "24px",
boxShadow:
"0 8px 25px rgba(0,0,0,.25)",
border: "1px solid #334155",
}}
>
<h2
style={{
color: "white",
margin: 0,
}}
>
🎁 Daily Reward
</h2>

  <p
    style={{
      color: "#94a3b8",
      marginTop: "8px",
    }}
  >
    Claim your daily reward once every 24 hours.
  </p>

  <h1
    style={{
      color: "#22c55e",
      marginTop: "15px",
      fontSize: "32px",
    }}
  >
    KES {REWARD}
  </h1>

  <button
    onClick={claimReward}
    disabled={claimedToday || loading}
    style={{
      width: "100%",
      marginTop: "18px",
      padding: "14px",
      border: "none",
      borderRadius: "12px",
      background:
        claimedToday || loading
          ? "#475569"
          : "linear-gradient(90deg,#2563eb,#7c3aed)",
      color: "white",
      cursor:
        claimedToday || loading
          ? "not-allowed"
          : "pointer",
      fontWeight: "bold",
      fontSize: "16px",
    }}
  >
    {loading
      ? "⏳ Processing Reward..."
      : claimedToday
      ? "✅ Claimed Today"
      : "🎁 Claim KES 50"}
  </button>
</div>

);
}