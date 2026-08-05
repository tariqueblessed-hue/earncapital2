"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TopNavbar from "@/components/dashboard/TopNavbar";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function TransactionsPage() {
  const [username, setUsername] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("username")
      .eq("email", user.email)
      .single();

    if (!profile) {
      setLoading(false);
      return;
    }

    setUsername(profile.username);

    const items: Transaction[] = [];// Load Deposits
    const { data: deposits } = await supabase
      .from("deposits")
      .select("id, amount, status, created_at")
      .eq("username", profile.username);

    deposits?.forEach((d: any) => {
      items.push({
        id: `deposit-${d.id}`,
        type: "Deposit",
        amount: Number(d.amount),
        status: d.status,
        created_at: d.created_at,
      });
    });

    // Load Withdrawals
    const { data: withdrawals } = await supabase
      .from("withdrawals")
      .select("id, amount, status, created_at")
      .eq("username", profile.username);

    withdrawals?.forEach((w: any) => {
      items.push({
        id: `withdraw-${w.id}`,
        type: "Withdrawal",
        amount: Number(w.amount),
        status: w.status,
        created_at: w.created_at,
      });
    });

    // Load Task Rewards
    const { data: rewards } = await supabase
      .from("task_answers")
      .select("id, reward_paid, created_at")
      .eq("username", profile.username)
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
    setLoading(false);
  }return (
    <DashboardLayout>
      <TopNavbar username={username || "Transactions"} />

      <div
        style={{
          marginTop: "20px",
          background: "#111827",
          borderRadius: "20px",
          padding: "25px",
          color: "white",
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
          <div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              📜 Transaction History
            </h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px",
              }}
            >
              View all your deposits, withdrawals and rewards.
            </p>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#9ca3af",
            }}
          >
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#9ca3af",
            }}
          >
            No transactions found.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >{transactions.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#1f2937",
                  borderRadius: "16px",
                  padding: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #374151",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {item.type}
                  </div>

                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      marginTop: "6px",
                    }}
                  >
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color:
                        item.type === "Withdrawal"
                          ? "#ef4444"
                          : "#22c55e",
                    }}
                  >
                    {item.type === "Withdrawal" ? "-" : "+"}
                    KES {item.amount.toLocaleString()}
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#fff",
                      background:
                        item.status === "Approved" ||
                        item.status === "Completed"
                          ? "#16a34a"
                          : item.status === "Pending"
                          ? "#ca8a04"
                          : "#dc2626",
                    }}
                  >
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}