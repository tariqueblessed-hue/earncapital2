"use client";

import { useState } from "react";

export default function BroadcastPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendBroadcast = () => {
    if (!title || !message) {
      alert("Fill all fields");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    users.forEach((user: any) => {
      const key = `notifications_${user.username}`;

      const notifications = JSON.parse(
        localStorage.getItem(key) || "[]"
      );

      notifications.unshift({
        title: "📢 " + title,
        message,
        date: new Date().toLocaleString(),
      });

      localStorage.setItem(
        key,
        JSON.stringify(notifications)
      );
    });

    alert("✅ Broadcast sent to all users!");

    setTitle("");
    setMessage("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1>📢 Broadcast Center</h1>

      <input
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={input}
      />

      <textarea
        placeholder="Write your announcement..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={textarea}
      />

      <button
        style={button}
        onClick={sendBroadcast}
      >
        🚀 Send To All Users
      </button>
    </main>
  );
}

const input = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  borderRadius: "10px",
  border: "none",
};

const textarea = {
  width: "100%",
  height: "180px",
  marginTop: "20px",
  padding: "15px",
  borderRadius: "10px",
  border: "none",
};

const button = {
  marginTop: "20px",
  padding: "15px",
  width: "100%",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};