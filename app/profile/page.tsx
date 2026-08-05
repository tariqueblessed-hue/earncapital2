"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

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

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error || !data) {
      alert("Unable to load profile.");
      setLoading(false);
      return;
    }

    setFullName(data.full_name || "");
    setUsername(data.username || "");
    setPhone(data.phone || "");
    setEmail(data.email || "");

    setLoading(false);
  }

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return;

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        username: username,
        phone: phone,
      })
      .eq("email", user.email);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Profile updated successfully.");
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
          Loading Profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout><div
        style={{
          maxWidth: "700px",
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
          👤 My Profile
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Update your personal information.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "42px",
              fontWeight: "800",
              color: "white",
            }}
          >
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        <label style={label}>Full Name</label>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={input}
        />

        <label style={label}>Username</label>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={input}
        />

        <label style={label}>Phone Number</label>

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
        />

        <label style={label}>Email Address</label>

        <input
          value={email}
          disabled
          style={{
            ...input,
            opacity: 0.7,
            cursor: "not-allowed",
          }}
        /><button
          onClick={saveProfile}
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
          💾 Save Changes
        </button>

      </div>

    </DashboardLayout>
  );
}

const label = {
  display: "block" as const,
  marginTop: "18px",
  marginBottom: "8px",
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