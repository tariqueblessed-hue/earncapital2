"use client";

import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaCreditCard,
  FaShieldAlt,
  FaChevronRight,
} from "react-icons/fa";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "850px",
          margin: "30px auto",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          ⚙️ Settings
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "35px",
          }}
        >
          Manage your account settings.
        </p><Link href="/profile" style={card}>
          <div style={left}>
            <FaUser size={24} color="#38bdf8" />
            <div>
              <h3 style={title}>Profile</h3>
              <p style={subtitle}>Manage your personal information</p>
            </div>
          </div>
          <FaChevronRight color="#94a3b8" />
        </Link>

        <Link href="/change_password" style={card}>
          <div style={left}>
            <FaLock size={24} color="#f97316" />
            <div>
              <h3 style={title}>Security</h3>
              <p style={subtitle}>Change Password</p>
            </div>
          </div>
          <FaChevronRight color="#94a3b8" />
        </Link>

        <Link href="/notifications" style={card}>
          <div style={left}>
            <FaBell size={24} color="#facc15" />
            <div>
              <h3 style={title}>Notifications</h3>
              <p style={subtitle}>Manage Notifications</p>
            </div>
          </div>
          <FaChevronRight color="#94a3b8" />
        </Link>

        <Link href="/appearance" style={card}>
          <div style={left}>
            <FaPalette size={24} color="#f472b6" />
            <div>
              <h3 style={title}>Appearance</h3>
              <p style={subtitle}>Light / Dark Mode</p>
            </div>
          </div>
          <FaChevronRight color="#94a3b8" />
        </Link>

        <Link href="/payment_method" style={card}>
          <div style={left}>
            <FaCreditCard size={24} color="#22c55e" />
            <div>
              <h3 style={title}>Payment Methods</h3>
              <p style={subtitle}>Manage M-Pesa, PayPal & Bank</p>
            </div>
          </div>
          <FaChevronRight color="#94a3b8" />
        </Link>

        <Link href="/privacy" style={card}>
          <div style={left}>
            <FaShieldAlt size={24} color="#60a5fa" />
            <div>
              <h3 style={title}>Privacy</h3>
              <p style={subtitle}>Privacy Settings</p>
            </div>
          </div>
          <FaChevronRight color="#94a3b8" />
        </Link></div>
    </DashboardLayout>
  );
}

const card = {
  display: "flex" as const,
  justifyContent: "space-between",
  alignItems: "center",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "18px",
  padding: "22px",
  marginBottom: "18px",
  textDecoration: "none",
  color: "white",
  transition: "0.25s",
};

const left = {
  display: "flex" as const,
  alignItems: "center",
  gap: "18px",
};

const title = {
  margin: 0,
  fontSize: "21px",
  fontWeight: "700",
};

const subtitle = {
  margin: "6px 0 0",
  color: "#94a3b8",
  fontSize: "14px",
};