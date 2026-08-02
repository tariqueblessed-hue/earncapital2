"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) return;

    const { data: profile } = await supabase
      .from("users")
      .select("username")
      .eq("email", user.email)
      .single();

    if (!profile) return;

    const username = profile.username;

    const items: Transaction[] = [];

    // Deposits
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
        created_at: d.created_at,
      });
    });

    // Withdrawals
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
        created_at: w.created_at,
      });
    });

    // Task Rewards
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
        created_at: r.created_at,
      });
    });

    items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

    setTransactions(items);
  }return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,.2)",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "18px",
          fontSize: "22px",
        }}
      >
        📜 Recent Transactions
      </h2>

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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "white",
          }}
        >
          <thead>
            <tr>
              <th style={th}>Type</th>
              <th style={th}>Amount</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td style={td}>{item.type}</td>

                <td style={td}>
                  KES {item.amount.toLocaleString()}
                </td>

                <td style={td}>
                  <span
                    style={{
                      background:
                        item.status === "Approved" ||
                        item.status === "Completed"
                          ? "#16a34a"
                          : item.status === "Pending"
                          ? "#ca8a04"
                          : "#dc2626",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  textAlign: "left" as const,
  padding: "12px",
  borderBottom: "1px solid #374151",
  color: "#94a3b8",
  fontSize: "14px",
};

const td = {
  padding: "14px 12px",
  borderBottom: "1px solid #1f2937",
};