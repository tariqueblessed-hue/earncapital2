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
        background:
          "linear-gradient(135deg,#020617,#312e81,#7c3aed)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          width: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={input}
        />

        <button
          onClick={login}
          disabled={loading}
          style={button}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </main>
  );
}

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const button = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
};