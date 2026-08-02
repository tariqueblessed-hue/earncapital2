"use client";

import { useEffect, useState } from "react";

export default function ReferralsPage() {
  const [user, setUser] = useState("");
  const [referrals, setReferrals] = useState(0);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    const currentUser =
      localStorage.getItem("currentUser") || "";

    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);

    const savedReferrals =
      Number(
        localStorage.getItem(
          `referrals_${currentUser}`
        )
      ) || 0;

    setReferrals(savedReferrals);

    setEarnings(savedReferrals * 100);
  }, []);

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${user}`
      : "";

  const copyLink = () => {
    navigator.clipboard.writeText(
      referralLink
    );

    alert(
      "✅ Referral link copied successfully"
    );
  };

  const progress = Math.min(
    (referrals / 5) * 100,
    100
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)",
        color: "white",
        padding: "25px",
        fontFamily: "Arial",
      }}
    >
      <h1>👥 Referral Center</h1>

      <p style={{ color: "#cbd5e1" }}>
        Invite friends and earn rewards.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <div style={card}>
          <h3>Total Referrals</h3>
          <h1>{referrals}</h1>
        </div>

        <div style={card}>
          <h3>Referral Earnings</h3>
          <h1>KES {earnings}</h1>
        </div>
      </div>

      <div
        style={{
          marginTop: "25px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h2>📈 Referral Progress</h2>

        <p>
          {referrals} / 5 Referrals
        </p>

        <div
          style={{
            height: "15px",
            background: "#334155",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background:
                "linear-gradient(90deg,#22c55e,#10b981)",
            }}
          />
        </div>

        {referrals >= 5 ? (
          <p
            style={{
              color: "#22c55e",
              marginTop: "15px",
            }}
          >
            ✅ Withdrawal Requirement Unlocked
          </p>
        ) : (
          <p
            style={{
              color: "#fbbf24",
              marginTop: "15px",
            }}
          >
            Need {5 - referrals} more referrals
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: "25px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h2>🔗 Your Referral Link</h2>

        <input
          value={referralLink}
          readOnly
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            marginTop: "10px",
          }}
        />

        <button
          onClick={copyLink}
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white",
            cursor: "pointer",
          }}
        >
          📋 Copy Referral Link
        </button>
      </div>

      <button
        onClick={() =>
          (window.location.href =
            "/dashboard")
        }
        style={{
          marginTop: "30px",
          padding: "14px 25px",
          border: "none",
          borderRadius: "10px",
          background: "#334155",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Back Dashboard
      </button>
    </main>
  );
}

const card = {
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  padding: "20px",
  borderRadius: "15px",
};