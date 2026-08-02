"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSetting } from "@/app/lib/settings";

export default function ActivatePage() {
  const [user, setUser] = useState<any>(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [loading, setLoading] = useState(false);

  const activationFee = 300;

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);
  }

  async function submitActivation() {
    if (!transactionCode) {
      alert("Enter your M-Pesa transaction code.");
      return;
    }

    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from("activation_requests")
      .insert([
        {
          user_id: user.id,
          email: user.email,
          transaction_code: transactionCode,
          amount: activationFee,
          status: "Pending",
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Activation request submitted successfully.");

    window.location.href = "/dashboard";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#1e293b",
          padding: "25px",
          borderRadius: "18px",
        }}
      >
        <h1>🔐 Activate Account</h1>

        <p>
          Activation Fee:
          <strong> KES {activationFee}</strong>
        </p>

        <p>Send payment to:</p>

        <h2 style={{ color: "#22c55e" }}>
          📱 0143390270
        </h2>

        <input
          placeholder="M-Pesa Transaction Code"
          value={transactionCode}
          onChange={(e) => setTransactionCode(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "20px",
            borderRadius: "10px",
            border: "none",
          }}
        />

        <button
          onClick={submitActivation}
          disabled={loading}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background:
              "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Submitting..."
            : "Submit Activation"}
        </button>
      </div>
    </main>
  );
}