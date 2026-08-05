"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function PrivacyPage() {
  const [loading, setLoading] = useState(true);

  const [hideEmail, setHideEmail] = useState(false);
  const [hidePhone, setHidePhone] = useState(false);
  const [privateProfile, setPrivateProfile] =
    useState(false);

  useEffect(() => {
    loadPrivacy();
  }, []);

  async function loadPrivacy() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      setHideEmail(data.hide_email ?? false);
      setHidePhone(data.hide_phone ?? false);
      setPrivateProfile(
        data.private_profile ?? false
      );
    }

    setLoading(false);
  }

  async function savePrivacy() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return;

    const { error } = await supabase
      .from("users")
      .update({
        hide_email: hideEmail,
        hide_phone: hidePhone,
        private_profile: privateProfile,
      })
      .eq("email", user.email);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Privacy settings updated.");
  }async function deleteAccount() {
    const confirmDelete = confirm(
      "⚠️ Are you sure you want to delete your account?\n\nThis action cannot be undone."
    );

    if (!confirmDelete) return;

    alert(
      "Account deletion request has been received.\n\nPlease contact support to permanently remove your account."
    );
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
          Loading Privacy Settings...
        </div>
      </DashboardLayout>
    );
  }

  return (
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
          🔒 Privacy
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Control who can see your personal information.
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
              type="checkbox"
              checked={hideEmail}
              onChange={() =>
                setHideEmail(!hideEmail)
              }
            />
            Hide my email address
          </label>

          <label style={label}>
            <input
              type="checkbox"
              checked={hidePhone}
              onChange={() =>
                setHidePhone(!hidePhone)
              }
            />
            Hide my phone number
          </label>

          <label style={label}>
            <input
              type="checkbox"
              checked={privateProfile}
              onChange={() =>
                setPrivateProfile(!privateProfile)
              }
            />
            Make my profile private
          </label><button
            onClick={savePrivacy}
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
            💾 Save Privacy Settings
          </button>

          <button
            onClick={deleteAccount}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#dc2626",
              color: "white",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            🗑️ Delete My Account
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
  fontSize: "16px",
  color: "#e2e8f0",
};