"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SettingsPage() {
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
    <DashboardLayout>

      <div
        style={{
          maxWidth: "1100px",
          margin: "30px auto",
          color: "white",
        }}
      ><h1
          style={{
            fontSize: "40px",
            marginBottom: "10px",
            fontWeight: "bold",
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
            gap: "25px",
          }}
        >
          <SettingsCard
            icon="👤"
            title="Profile"
            subtitle={username}
          />

          <SettingsCard
            icon="📧"
            title="Email"
            subtitle={email}
          />

          <SettingsCard
            icon="📱"
            title="Phone Number"
            subtitle={phone || "Not Added"}
          />

          <SettingsCard
            icon="💰"
            title="Wallet Balance"
            subtitle={`KES ${balance.toLocaleString()}`}
          />

          <SettingsCard
            icon="🔒"
            title="Security"
            subtitle="Change Password"
          />

          <SettingsCard
            icon="🔔"
            title="Notifications"
            subtitle="Manage Notifications"
          />

          <SettingsCard
            icon="🎨"
            title="Appearance"
            subtitle="Light / Dark Mode"
          />

          <SettingsCard
            icon="💳"
            title="Payment Methods"
            subtitle="Manage Mpesa"
          />

          <SettingsCard
            icon="🛡️"
            title="Privacy"
            subtitle="Privacy Settings"
          />
        </div>

        <button
          style={{
            marginTop: "35px",
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "16px",
            background: "#dc2626",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
        >
          🚪 Logout
        </button></div>

    </DashboardLayout>
  );
}

function SettingsCard({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "18px",
        padding: "22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "0.3s",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            color: "white",
            fontSize: "18px",
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
          fontSize: "30px",
        }}
      >
        {icon}
      </div>
    </div>
  );
}