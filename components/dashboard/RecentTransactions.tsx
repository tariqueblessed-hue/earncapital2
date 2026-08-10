"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Transaction = {
id: string;
type: string;
amount: number;
status: string;
created_at: string;
};

export default function RecentTransactions() {
const router = useRouter();

const [transactions, setTransactions] = useState<Transaction[]>([]);

useEffect(() => {
loadTransactions();

const handleFocus = () => {
  loadTransactions();
};

window.addEventListener("focus", handleFocus);

return () => {
  window.removeEventListener("focus", handleFocus);
};

}, []);

function safeDate(value: any): string {
if (!value) {
return new Date().toISOString();
}

const parsed = new Date(value);

if (!Number.isNaN(parsed.getTime())) {
  return parsed.toISOString();
}

return new Date().toISOString();

}

async function loadTransactions() {
try {
const {
data: { user },
} = await supabase.auth.getUser();

  if (!user?.email) return;

  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("email", user.email)
    .single();

  if (!profile) return;

  const username = profile.username;

  const items: Transaction[] = [];

  // -----------------------------
  // Deposits
  // -----------------------------

  const { data: deposits } = await supabase
    .from("deposits")
    .select("id, amount, status, created_at")
    .eq("username", username);

  deposits?.forEach((d: any) => {
    items.push({
      id: `deposit-${d.id}`,
      type: "Deposit",
      amount: Number(d.amount),
      status: d.status,
      created_at: safeDate(d.created_at),
    });
  });

  // -----------------------------
  // Withdrawals
  // -----------------------------

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("id, amount, status, created_at")
    .eq("username", username);

  withdrawals?.forEach((w: any) => {
    items.push({
      id: `withdraw-${w.id}`,
      type: "Withdrawal",
      amount: Number(w.amount),
      status: w.status,
      created_at: safeDate(w.created_at),
    });
  });

  // -----------------------------
  // Task Rewards
  // -----------------------------

  const { data: rewards } = await supabase
    .from("task_answers")
    .select("id, reward_paid, created_at")
    .eq("username", username)
    .gt("reward_paid", 0);

  rewards?.forEach((r: any) => {
    items.push({
      id: `reward-${r.id}`,
      type: "Task Reward",
      amount: Number(r.reward_paid),
      status: "Completed",
      created_at: safeDate(r.created_at),
    });
  });

  // -----------------------------
  // Daily Rewards
  // -----------------------------

  const localTransactions = JSON.parse(
    localStorage.getItem(
      `transactions_${username}`
    ) || "[]"
  );

  localTransactions.forEach(
    (transaction: any, index: number) => {
      if (
        transaction.type === "Daily Reward" ||
        transaction.description === "🎁 Daily Reward"
      ) {
        const rewardDate =
          transaction.created_at ||
          transaction.date;

        items.push({
          id: `daily-reward-${index}-${rewardDate || index}`,
          type: "Daily Reward",
          amount: Number(transaction.amount || 50),
          status: "Completed",
          created_at: safeDate(rewardDate),
        });
      }
    }
  );

  // -----------------------------
  // Sort newest first
  // -----------------------------

  items.sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  // Show latest 3 on dashboard
  setTransactions(items.slice(0, 3));
} catch (error) {
  console.error(
    "Failed to load recent transactions:",
    error
  );
}

}

return (
<div
style={{
background: "#111827",
borderRadius: "18px",
padding: "20px",
boxShadow: "0 8px 20px rgba(0,0,0,.2)",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "20px",
}}
>
<h2
style={{
color: "white",
fontSize: "22px",
margin: 0,
}}
>
📜 Recent Transactions
</h2>

    <button
      onClick={() => router.push("/transactions")}
      style={{
        background: "transparent",
        border: "none",
        color: "#3b82f6",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      View All →
    </button>
  </div>

  {transactions.length === 0 ? (
    <p
      style={{
        color: "#94a3b8",
        textAlign: "center",
        padding: "30px",
      }}
    >
      No transactions yet.
    </p>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      {transactions.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#1f2937",
            borderRadius: "15px",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              {item.type}
            </div>

            <div
              style={{
                color: "#9ca3af",
                fontSize: "13px",
                marginTop: "5px",
              }}
            >
              {new Date(
                item.created_at
              ).toLocaleDateString()}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: "#22c55e",
                fontWeight: "800",
                fontSize: "17px",
              }}
            >
              KES{" "}
              {item.amount.toLocaleString()}
            </div>

            <span
              style={{
                display: "inline-block",
                marginTop: "6px",
                background:
                  item.status === "Approved" ||
                  item.status === "Completed"
                    ? "#16a34a"
                    : item.status === "Pending"
                    ? "#ca8a04"
                    : "#dc2626",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                color: "#fff",
              }}
            >
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

);
}