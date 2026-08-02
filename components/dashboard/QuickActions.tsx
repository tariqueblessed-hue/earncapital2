"use client";

import Link from "next/link";

const actions = [
  {
    title: "Deposit",
    icon: "💳",
    href: "/payment",
    color: "#2563eb",
  },
  {
    title: "Withdraw",
    icon: "💸",
    href: "/withdrawals",
    color: "#16a34a",
  },
  {
    title: "Tasks",
    icon: "✅",
    href: "/tasks",
    color: "#7c3aed",
  },
  {
    title: "Referrals",
    icon: "👥",
    href: "/referrals",
    color: "#f59e0b",
  },
];

export default function QuickActions() {
  return (
    <div style={{ marginTop: "24px" }}>
      <h2
        style={{
          color: "white",
          marginBottom: "16px",
          fontSize: "22px",
        }}
      >
        ⚡ Quick Actions
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
          gap: "16px",
        }}
      >
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: action.color,
                color: "white",
                borderRadius: "18px",
                padding: "20px",
                minHeight: "110px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 8px 18px rgba(0,0,0,.2)",
                transition: ".3s",
              }}
            >
              <div style={{ fontSize: "32px" }}>
                {action.icon}
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                  }}
                >
                  {action.title}
                </h3>

                <small>Open →</small>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}