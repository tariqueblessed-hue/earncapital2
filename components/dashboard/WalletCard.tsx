"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type WalletCardProps = {
  username: string;
};

export default function WalletCard({
  username,
}: WalletCardProps) {
  const [realBalance, setRealBalance] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);

  async function loadBalance() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) return;

    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("email", user.email)
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    setRealBalance(Number(data?.balance ?? 0));
  }

  useEffect(() => {
    loadBalance();

    const interval = setInterval(() => {
      loadBalance();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let start = 0;

    const step = Math.max(1, Math.ceil(realBalance / 60));

    const timer = setInterval(() => {
      start += step;

      if (start >= realBalance) {
        start = realBalance;
        clearInterval(timer);
      }

      setDisplayBalance(start);
    }, 20);

    return () => clearInterval(timer);
  }, [realBalance]);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#2563eb,#4f46e5,#7c3aed)",
        borderRadius: "18px",
        padding: "24px",
        color: "white",
        boxShadow:
          "0 10px 25px rgba(37,99,235,.25)",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              opacity: 0.85,
              fontSize: "14px",
            }}
          >
            Available Balance
          </p>

          <h1
            style={{
              margin: "10px 0",
              fontSize: "38px",
              fontWeight: "bold",
            }}
          >
            KES {displayBalance.toLocaleString()}
          </h1>

          <span
            style={{
              background: "rgba(255,255,255,.18)",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "13px",
            }}
          >
            ⭐ Premium Member
          </span>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "42px" }}>💳</div>
          <small>EarnCapital</small>
        </div>
      </div>

      <div
        style={{
          marginTop: "22px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <small>Monthly Earnings</small>
          <h3>
            KES {Math.floor(realBalance * 0.15).toLocaleString()}
          </h3>
        </div>

        <div>
          <small>Status</small>
          <h3>Active ✅</h3>
        </div>
      </div>
    </div>
  );
}