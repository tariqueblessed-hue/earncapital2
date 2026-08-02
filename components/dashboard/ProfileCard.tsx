"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  username: string;
};

export default function ProfileCard({ username }: Props) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, [username]);

  async function loadProfile() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (!error && data) {
      setUser(data);
    }
  }

  if (!user) return null;

  const balance = Number(user.balance || 0);

  let level = "🥉 Bronze";

  if (balance >= 50000)
    level = "👑 Diamond";
  else if (balance >= 20000)
    level = "💎 Platinum";
  else if (balance >= 5000)
    level = "🥇 Gold";
  else if (balance >= 1000)
    level = "🥈 Silver";

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "20px",
        padding: "25px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          {user.full_name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{user.full_name}</h2>
          <p>@{user.username}</p>
        </div>
      </div>

      <p>📧 {user.email}</p>

      <p>📱 {user.phone}</p>

      <p>🏅 {level}</p>

      <p>💰 KES {balance.toLocaleString()}</p>

      <p>⭐ Premium Member</p>
    </div>
  );
}