"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function changePassword() {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Password changed successfully!");

    router.push("/settings");
  }

  return (
    <DashboardLayout><div
        style={{
          maxWidth: "650px",
          margin: "30px auto",
          background: "#111827",
          borderRadius: "20px",
          padding: "30px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          🔒 Change Password
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Create a strong password to keep your account secure.
        </p>

        <label style={label}>New Password</label>

        <div
          style={{
            position: "relative",
            marginBottom: "20px",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={input}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={eyeButton}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <label style={label}>Confirm Password</label>

        <div
          style={{
            position: "relative",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            style={input}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={eyeButton}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div><button
          onClick={changePassword}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "30px",
            padding: "16px",
            border: "none",
            borderRadius: "14px",
            background: "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white",
            fontSize: "17px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(124,58,237,.35)",
          }}
        >
          {loading ? "Updating Password..." : "🔒 Update Password"}
        </button>

      </div>

    </DashboardLayout>
  );
}

const label = {
  display: "block" as const,
  marginBottom: "8px",
  marginTop: "15px",
  color: "#cbd5e1",
  fontWeight: "600",
};

const input = {
  width: "100%",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #374151",
  background: "#1f2937",
  color: "#ffffff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const eyeButton = {
  position: "absolute" as const,
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "20px",
  color: "#cbd5e1",
};