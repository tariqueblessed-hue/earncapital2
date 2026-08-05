"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      setUsername(data.username || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setBalance(Number(data.balance || 0));
    }

    setLoading(false);
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
          Loading Settings...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout><div
        style={{
          maxWidth: "1100px",
          margin: "30px auto",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          ⚙️ Settings
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Manage your EarnCapital account and preferences.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "22px",
          }}
        >

          <SettingsCard
            icon="👤"
            title="Profile"
            subtitle={username}
            onClick={() => router.push("/profile")}
          />

          <SettingsCard
            icon="📧"
            title="Email"
            subtitle={email}
            onClick={() => router.push("/profile")}
          />

          <SettingsCard
            icon="📱"
            title="Phone Number"
            subtitle={phone || "Not Added"}
            onClick={() => router.push("/profile")}
          />

          <SettingsCard
            icon="💰"
            title="Wallet Balance"
            subtitle={`KES ${balance.toLocaleString()}`}
            onClick={() => router.push("/transactions")}
          />

          <SettingsCard
            icon="🔒"
            title="Security"
            subtitle="Change Password"
            onClick={() => router.push("/change-password")}
          /><SettingsCard
            icon="🔔"
            title="Notifications"
            subtitle="Manage Notifications"
            onClick={() => router.push("/notifications")}
          />

          <SettingsCard
            icon="🎨"
            title="Appearance"
            subtitle="Light / Dark Mode"
            onClick={() => alert("Coming Soon")}
          />

          <SettingsCard
            icon="💳"
            title="Payment Methods"
            subtitle="Manage M-Pesa"
            onClick={() => router.push("/payment-methods")}
          />

          <SettingsCard
            icon="🛡️"
            title="Privacy"
            subtitle="Privacy Settings"
            onClick={() => router.push("/privacy")}
          />

        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          style={{
            width: "100%",
            marginTop: "35px",
            padding: "18px",
            border: "none",
            borderRadius: "16px",
            background: "#dc2626",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>

      </div>

    </DashboardLayout>
  );
}function SettingsCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "18px",
        padding: "22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            marginTop: "8px",
            color: "#94a3b8",
            fontSize: "15px",
          }}
        >
          {subtitle}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontSize: "30px",
          }}
        >
          {icon}
        </span>

        <span
          style={{
            color: "#60a5fa",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          ›
        </span>
      </div>
    </div>
  );
}