"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const user = users.find(
      (u: any) =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    localStorage.setItem(
      "currentUser",
      username
    );

    alert("Login successful!");

    window.location.href = "/";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111827",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#1f2937",
          padding: "30px",
          borderRadius: "12px",
          width: "300px",
        }}
      >
        <h1>Login</h1>

        <p style={{ marginBottom: "15px" }}>
          Don't have an account?{" "}
          <a href="/register">
            Register
          </a>
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
            background: "#2563eb",
            color: "white",
            border: "none",
          }}
        >
          Login
        </button>
      </div>
    </main>
  );
}