"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TopNavbar from "@/components/dashboard/TopNavbar";
import WalletCard from "@/components/dashboard/WalletCard";
import DailyReward from "@/components/dashboard/DailyRewards";
import LevelCard from "@/components/dashboard/LevelCard";
import EarningsChart from "@/components/dashboard/EarningsChart";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ReferralCard from "@/components/dashboard/ReferralCard";
import NotificationCard from "@/components/dashboard/NotificationCard";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function DashboardPage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("email", user.email)
      .single();

    if (error || !data) {
      alert("Unable to load your profile.");
      return;
    }

    setUsername(data.username);
  }

  if (!username) return null;

  return (
    <DashboardLayout>
      <TopNavbar username={username} />

      <WalletCard username={username} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "20px",
          alignItems: "start",
        }}
      >
        <div>
          <DailyReward username={username} />

          <LevelCard username={username} />

          <EarningsChart />

          <StatsGrid username={username} />

          <QuickActions />

          <div style={{ marginTop: "25px" }}>
            <RecentTransactions />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <ProfileCard username={username} />

          <ReferralCard username={username} />

          <NotificationCard />
        </div>
      </div>
    </DashboardLayout>
  );
}