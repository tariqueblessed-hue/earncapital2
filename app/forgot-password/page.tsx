"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function resetPassword() {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "✅ Password reset email sent.\n\nCheck your inbox and spam folder."
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#020617,#1e1b4b,#7c3aed)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
        <h1
          style={{
            color: "#111827",
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Forgot Password
        </h1>

        <p
          style={{
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "20px",
            lineHeight: "1.5",
          }}
        >
          Enter your email address to receive a password reset link.
        </p>
<input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    color: "#111827",
    background: "#ffffff",
    fontSize: "16px",
  }}
/>

        <button
          onClick={resetPassword}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </main>
  );
}