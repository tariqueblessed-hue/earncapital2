"use client";

export default function AdminSidebar() {
  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "25px",
        position: "fixed",
        left: 0,
        top: 0,
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ color: "#60a5fa" }}>
        👑 EarnCapital Admin
      </h2>
    </aside>
  );
}