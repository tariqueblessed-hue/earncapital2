"use client";

type TopNavbarProps = {
  username: string;
};

export default function TopNavbar({
  username,
}: TopNavbarProps) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        background: "#111827",
        padding: "22px 28px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div>
        <h1
          style={{
            color: "white",
            margin: 0,
            fontSize: "32px",
          }}
        >
          👋 {greeting}, {username}
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "8px",
          }}
        >
          Welcome back to EarnCapital
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <button
          style={{
            background: "#1e293b",
            border: "none",
            color: "white",
            padding: "12px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          🔔
        </button>

        <button
          style={{
            background: "#1e293b",
            border: "none",
            color: "white",
            padding: "12px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          🌙
        </button>

        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}