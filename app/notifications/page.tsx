"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const user =
      localStorage.getItem("currentUser") || "";

    const saved = JSON.parse(
      localStorage.getItem(
        `notifications_${user}`
      ) || "[]"
    );

    setNotifications(saved);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        notifications.map(
          (item, index) => (
            <div
              key={index}
              style={{
                background: "#1f2937",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <p>{item.message}</p>
              <small>{item.date}</small>
            </div>
          )
        )
      )}
    </main>
  );
}