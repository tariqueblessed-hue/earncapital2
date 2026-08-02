"use client";

export default function UserSidebar() {
  const menu = [
    { title: "🏠 Dashboard", link: "/dashboard" },
    { title: "🧠 Tasks", link: "/tasks" },
    { title: "💳 Deposit", link: "/payment" },
    { title: "💸 Withdraw", link: "/withdrawals" },
    { title: "👥 Referrals", link: "/referrals" },
    { title: "📜 History", link: "/history" },
    { title: "🔔 Notifications", link: "/notifications" },
    { title: "👤 Profile", link: "/profile" },
  ];

  return (
    <aside
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        👑 EarnCapital
      </h2>

      {menu.map((item) => (
        <button
          key={item.link}
          onClick={() => (window.location.href = item.link)}
          style={{
            padding: "14px",
            marginBottom: "12px",
            border: "none",
            borderRadius: "12px",
            background: "#1e293b",
            color: "white",
            cursor: "pointer",
            textAlign: "left",
            fontSize: "15px",
          }}
        >
          {item.title}
        </button>
      ))}

      <button
        onClick={() => {
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
        }}
        style={{
          marginTop: "auto",
          padding: "14px",
          border: "none",
          borderRadius: "12px",
          background: "#dc2626",
          color: "white",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}