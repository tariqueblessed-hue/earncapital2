"use client";

import { useState } from "react";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function loginAdmin() {
    if (username === "admin" && password === "123456") {
      localStorage.setItem("adminLoggedIn", "true");
      alert("Admin Login Successful");
      window.location.href = "/admin/dashboard";
    } else {
      alert("Invalid Admin Credentials");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "15px",
          width: "350px",
          color: "white",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          Admin Login
        </h1>

        <input
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
          }}
        />

        <button
          onClick={loginAdmin}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Login as Admin
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Admin login:
          <br />
          Username: admin
          <br />
          Password: 123456
        </p>
      </div>
    </main>
  );
}