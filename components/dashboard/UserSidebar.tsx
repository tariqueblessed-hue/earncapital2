"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠" },
  { name: "Tasks", href: "/tasks", icon: "✅" },
  { name: "Deposit", href: "/payment", icon: "💳" },
  { name: "Withdraw", href: "/withdrawals", icon: "💸" },
  { name: "Referrals", href: "/referrals", icon: "👥" },
  { name: "History", href: "/history", icon: "📜" },
  { name: "Notifications", href: "/notifications", icon: "🔔" },
  { name: "Profile", href: "/profile", icon: "👤" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function UserSidebar() {
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }

  return (
    <aside
      style={{
        width: "270px",
        minHeight: "100vh",
        background: "linear-gradient(180deg,#08142c,#111827)",
        padding: "25px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div>
        <h2
          style={{
            marginBottom: "35px",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          👑 EarnCapital
        </h2>

        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textDecoration: "none",
              color: pathname === item.href ? "#fff" : "#cbd5e1",
              background:
                pathname === item.href
                  ? "linear-gradient(90deg,#2563eb,#7c3aed)"
                  : "transparent",
              padding: "14px 18px",
              borderRadius: "14px",
              marginBottom: "10px",
              transition: ".3s",
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>

      <button
        onClick={logout}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "14px",
          borderRadius: "14px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}