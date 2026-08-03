"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Load username from users table
    const { data: profile } = await supabase
      .from("users")
      .select("username")
      .eq("email", email)
      .single();

    // Save session information
    localStorage.setItem("currentUserId", data.user.id);
    localStorage.setItem(
      "currentUser",
      profile?.username || ""
    );

    alert("✅ Login successful!");

    router.push("/dashboard");
  }

    return (
  <main
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      background:
        "linear-gradient(135deg,#020617,#1e1b4b,#7c3aed)",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "450px",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "35px",
        boxShadow: "0 25px 60px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "800",
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          Welcome Back 👋
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Login to your EarnCapital account
        </p>
      </div>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <button
        onClick={login}
        disabled={loading}
        style={button}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p
        style={{
          textAlign: "center",
          marginTop: "22px",
          color: "#6b7280",
        }}
      >
        Don't have an account?{" "}
        <a
          href="/register"
          style={{
            color: "#2563eb",
            fontWeight: "700",
            textDecoration: "none",
          }}
        >
          Create Account
        </a>
      </p>
    </div>
  </main>
);
}

const input = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  color: "#111827",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const button = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(90deg,#2563eb,#7c3aed)",
  color: "#ffffff",
  fontSize: "17px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 10px 25px rgba(124,58,237,.35)",
};