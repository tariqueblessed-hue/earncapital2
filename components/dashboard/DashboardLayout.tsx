"use client";

import { ReactNode } from "react";
import UserSidebar from "./UserSidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#081225",
      }}
    >
      <UserSidebar />

      <section
        style={{
          flex: 1,
          padding: "30px",
          color: "white",
        }}
      >
        {children}
      </section>
    </main>
  );
}