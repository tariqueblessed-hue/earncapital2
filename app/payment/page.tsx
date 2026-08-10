"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";

export default function AppDepositPage() {
  const amount = 300;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const depositNumber = "0143390270";

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("users")
      .select("balance")
      .eq("email", user.email)
      .single();

    if (data) {
      setBalance(Number(data.balance));
    }
  }

  async function submitDeposit() {
    if (!amount || !phoneNumber) {
      setToast({
        message: "Please enter your M-Pesa phone number.",
        type: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: Number(300),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setToast({
          message: result.error || "Failed to send STK Push.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("username")
          .eq("email", user.email)
          .single();

        await supabase.from("deposits").insert({
          username: profile?.username || "Unknown",
          email: user.email,
          phone: phoneNumber,
          amount: Number(amount),
          method: "M-Pesa",
          status: "Pending",
        });
      }

      setToast({
        message:
          "STK Push sent successfully! Check your phone and enter your M-PESA PIN.",
        type: "success",
      });

      setPhoneNumber("");
    } catch (error) {
      console.error(error);

      setToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020617,#111827,#312e81)",
        padding: "30px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          💎 Deposit Funds
        </h1>

        <p
          style={{
            color: "#cbd5e1",
          }}
        >
          Add money securely to your EarnCapital wallet.
        </p>
      </div>

      {/* Wallet */}

      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          padding: "25px",
          borderRadius: "22px",
          boxShadow: "0 20px 40px rgba(0,0,0,.3)",
          marginBottom: "25px",
        }}
      >
        <p
          style={{
            opacity: 0.8,
          }}
        >
          Current Balance
        </p>

        <h1
          style={{
            fontSize: "40px",
            margin: "10px 0",
          }}
        >
          KES {balance.toLocaleString()}
        </h1>

        <span
          style={{
            background: "rgba(255,255,255,.2)",
            padding: "8px 15px",
            borderRadius: "20px",
          }}
        >
          🔒 Secure Wallet
        </span>
      </div>

      {/* M-Pesa */}

      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "22px",
          padding: "25px",
          marginBottom: "25px",
        }}
      >
        <h2>📱 M-Pesa Deposit</h2>

        <p
          style={{
            color: "#cbd5e1",
          }}
        >
          Registration Fee
        </p>

        <div
          style={{
            background: "#020617",
            padding: "20px",
            borderRadius: "15px",
            marginTop: "15px",
          }}
        >
          <h1
            style={{
              color: "#22c55e",
              letterSpacing: "2px",
            }}
          >
            KES 300
          </h1>

          <p>
            Activate your EarnCapital account and start earning.
          </p>
        </div>
      </div>

      {/* Activation Form */}

      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "22px",
          padding: "25px",
          marginBottom: "25px",
        }}
      >
        <h2>🚀 Activate & Start Earning</h2>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "20px",
          }}
        >
          Enter your Safaricom number below. We will send an M-PESA STK Push
          to your phone.
        </p>

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "#cbd5e1",
          }}
        >
          M-Pesa Phone Number
        </label>

        <input
          type="tel"
          placeholder="07XXXXXXXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #475569",
            background: "#020617",
            color: "white",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={submitDeposit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            background: loading
              ? "#475569"
              : "linear-gradient(90deg,#22c55e,#16a34a)",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {loading
            ? "Sending STK Push..."
            : "🚀 Activate & Start Earning"}
        </button>
      </div>

      {/* Security */}

      <div
        style={{
          background: "linear-gradient(135deg,#064e3b,#065f46)",
          borderRadius: "22px",
          padding: "25px",
          marginBottom: "30px",
        }}
      >
        <h2>🔒 Secure Payments</h2>

        <p
          style={{
            color: "#d1fae5",
            lineHeight: "1.7",
          }}
        >
          Your payment is processed securely using Safaricom M-PESA STK Push.
          Once payment is successful your account will automatically be
          activated and your wallet credited.
        </p>

        <div
          style={{
            marginTop: "15px",
            background: "rgba(255,255,255,.15)",
            padding: "12px",
            borderRadius: "12px",
          }}
        >
          ✅ Automatic Account Activation
        </div>
      </div>
    </main>
  );
}