"use client";

import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referrer, setReferrer] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const ref = params.get("ref");

    if (ref) {
      setReferrer(ref);
    }
  }, []);

  const register = () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const userExists = users.find(
      (u: any) => u.username === username
    );

    if (userExists) {
      alert("Username already exists");
      return;
    }

    users.push({
      username,
      password,
      referredBy: referrer,
    });

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    if (referrer) {
      const currentReferrals =
        Number(
          localStorage.getItem(
            `referrals_${referrer}`
          )
        ) || 0;

      localStorage.setItem(
        `referrals_${referrer}`,
        (currentReferrals + 1).toString()
      );

      const currentBalance =
        Number(
          localStorage.getItem(
            `balance_${referrer}`
          )
        ) || 0;

      localStorage.setItem(
        `balance_${referrer}`,
        (currentBalance + 50).toString()
      );
    }

    alert("Registration successful!");

    window.location.href = "/login";
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
          width: "320px",
        }}
      >
        <h1>Register</h1>

        {referrer && (
          <p
            style={{
              color: "#22c55e",
              marginTop: "10px",
            }}
          >
            Referred by: {referrer}
          </p>
        )}

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
          onClick={register}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
            background: "#22c55e",
            color: "white",
            border: "none",
          }}
        >
          Register
        </button>
      </div>
    </main>
  );
}