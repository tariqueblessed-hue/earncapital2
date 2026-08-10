"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ReferralCardProps = {
  username: string;
};

export default function ReferralCard({
  username,
}: ReferralCardProps) {
  const [referrals, setReferrals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${encodeURIComponent(
          username
        )}`
      : "";

  useEffect(() => {
    if (!username) return;

    loadReferrals();

    const interval = setInterval(() => {
      loadReferrals();
    }, 5000);

    return () => clearInterval(interval);
  }, [username]);

  async function loadReferrals() {
    if (!username) return;

    try {
      const { count, error } = await supabase
        .from("users")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("referred_by", username);

      if (error) {
        console.error(
          "Referral loading error:",
          error.message
        );
        return;
      }

      setReferrals(count || 0);
    } catch (error) {
      console.error(
        "Referral loading failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to copy referral link:",
        error
      );
    }
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(145deg,#111827,#172554)",
        borderRadius: "20px",
        padding: "22px",
        marginBottom: "18px",
        border:
          "1px solid rgba(59,130,246,.25)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,.25)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              color: "white",
              fontSize: "20px",
              margin: 0,
              fontWeight: "800",
            }}
          >
            👥 Referrals
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "6px",
              marginBottom: 0,
              fontSize: "14px",
            }}
          >
            Invite friends and earn rewards
          </p>
        </div>

        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "23px",
            boxShadow:
              "0 8px 20px rgba(37,99,235,.25)",
          }}
        >
          👥
        </div>
      </div>

      {/* REFERRAL COUNT */}

      <div
        style={{
          marginTop: "20px",
          background: "#1f2937",
          borderRadius: "15px",
          padding: "16px",
        }}
      >
        <p
          style={{
            color: "#94a3b8",
            margin: 0,
            fontSize: "13px",
          }}
        >
          Total Referrals
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          <h1
            style={{
              color: "white",
              margin: 0,
              fontSize: "32px",
              fontWeight: "800",
            }}
          >
            {loading ? "..." : referrals}
          </h1>

          {!loading && referrals > 0 && (
            <span
              style={{
                background:
                  "rgba(34,197,94,.15)",
                color: "#4ade80",
                padding: "5px 9px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Active
            </span>
          )}
        </div>
      </div>

      {/* REFERRAL LINK */}

      <div style={{ marginTop: "18px" }}>
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "13px",
            marginBottom: "8px",
          }}
        >
          Your Referral Link
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            value={referralLink}
            readOnly
            onClick={(e) =>
              e.currentTarget.select()
            }
            style={{
              flex: 1,
              minWidth: 0,
              padding: "11px",
              borderRadius: "10px",
              border:
                "1px solid #374151",
              background: "#020617",
              color: "#cbd5e1",
              fontSize: "12px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={copyLink}
            style={{
              padding: "11px 14px",
              border: "none",
              borderRadius: "10px",
              background: copied
                ? "#16a34a"
                : "linear-gradient(135deg,#2563eb,#7c3aed)",
              color: "white",
              cursor: "pointer",
              fontWeight: "700",
              whiteSpace: "nowrap",
              transition:
                "all .2s ease",
            }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* INFO */}

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          borderRadius: "12px",
          background:
            "rgba(59,130,246,.08)",
          border:
            "1px solid rgba(59,130,246,.15)",
        }}
      >
        <p
          style={{
            color: "#93c5fd",
            fontSize: "12px",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          🔗 Share your personal link with
          friends. New users who register
          through your link will be connected
          to your referral account.
        </p>
      </div>
    </div>
  );
}