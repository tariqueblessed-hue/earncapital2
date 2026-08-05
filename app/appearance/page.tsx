"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AppearancePage() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    loadAppearance();
  }, []);

  async function loadAppearance() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("theme")
      .eq("email", user.email)
      .single();

    if (data?.theme) {
      setTheme(data.theme);
    }

    setLoading(false);
  }

  async function saveAppearance() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return;

    const { error } = await supabase
      .from("users")
      .update({
        theme,
      })
      .eq("email", user.email);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Appearance updated successfully.");
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            color: "white",
            fontSize: "24px",
            padding: "50px",
          }}
        >
          Loading Appearance...
        </div>
      </DashboardLayout>
    );
  }return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "800px",
          margin: "30px auto",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          🎨 Appearance
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Customize how EarnCapital looks for you.
        </p>

        <div
          style={{
            background: "#0f172a",
            borderRadius: "18px",
            border: "1px solid #334155",
            padding: "25px",
          }}
        >
          <label style={label}>
            <input
              type="radio"
              value="light"
              checked={theme === "light"}
              onChange={(e) => setTheme(e.target.value)}
            />
            ☀️ Light Mode
          </label>

          <label style={label}>
            <input
              type="radio"
              value="dark"
              checked={theme === "dark"}
              onChange={(e) => setTheme(e.target.value)}
            />
            🌙 Dark Mode
          </label>

          <label style={label}>
            <input
              type="radio"
              value="system"
              checked={theme === "system"}
              onChange={(e) => setTheme(e.target.value)}
            />
            📱 Follow Device Theme
          </label><button
            onClick={saveAppearance}
            style={{
              width: "100%",
              marginTop: "30px",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(90deg,#2563eb,#7c3aed)",
              color: "white",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            💾 Save Appearance
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

const label = {
  display: "flex" as const,
  alignItems: "center",
  gap: "12px",
  marginBottom: "20px",
  fontSize: "17px",
  color: "#e2e8f0",
};