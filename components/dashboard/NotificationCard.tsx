"use client";

type NotificationCardProps = {
  username: string;
};

export default function NotificationCard({
  username,
}: NotificationCardProps) {

  const notifications = JSON.parse(
    localStorage.getItem(`notifications_${username}`) || "[]"
  );

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,.2)",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "20px",
          marginBottom: "18px",
        }}
      >
        🔔 Notifications
      </h2>

      {notifications.length === 0 ? (
        <div
          style={{
            color: "#94a3b8",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          No notifications yet.
        </div>
      ) : (
        notifications.slice(0, 4).map((item: any, index: number) => (
          <div
            key={index}
            style={{
              background: "#1f2937",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          >
            <h4
              style={{
                color: "white",
                margin: "0 0 6px 0",
                fontSize: "15px",
              }}
            >
              {item.title}
            </h4>

            <p
              style={{
                color: "#cbd5e1",
                margin: 0,
                fontSize: "13px",
              }}
            >
              {item.message}
            </p>

            <small
              style={{
                color: "#94a3b8",
              }}
            >
              {item.date}
            </small>
          </div>
        ))
      )}
    </div>
  );
}