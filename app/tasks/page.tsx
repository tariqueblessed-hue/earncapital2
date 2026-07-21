"use client";

import { useEffect, useState } from "react";

export default function TasksPage() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const currentUser =
      localStorage.getItem("currentUser") || "";

    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);
  }, []);

  const completeTask = (reward: number) => {
    const currentBalance = Number(
      localStorage.getItem(`balance_${user}`) || "0"
    );

    const newBalance = currentBalance + reward;

    localStorage.setItem(
      `balance_${user}`,
      newBalance.toString()
    );

    alert(`Task completed! You earned KES ${reward}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>Tasks</h1>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h3>Watch a Video</h3>
        <p>Reward: KES 20</p>

        <button
          onClick={() => completeTask(20)}
          style={{
            padding: "10px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Complete Task
        </button>
      </div>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h3>Like a Post</h3>
        <p>Reward: KES 15</p>

        <button
          onClick={() => completeTask(15)}
          style={{
            padding: "10px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Complete Task
        </button>
      </div>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h3>Follow a Page</h3>
        <p>Reward: KES 25</p>

        <button
          onClick={() => completeTask(25)}
          style={{
            padding: "10px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Complete Task
        </button>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}