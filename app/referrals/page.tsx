"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReferralsPage() {
  const [user, setUser] = useState("");
  const [referrals, setReferrals] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [copying, setCopying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralStats();
  }, []);

  async function loadReferralStats() {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser?.email) {
        window.location.href = "/login";
        return;
      }

      const { data: profile, error } =
        await supabase
          .from("users")
          .select("username")
          .eq("email", authUser.email)
          .single();

      if (error || !profile) {
        console.error(
          "Profile error:",
          error
        );
        setLoading(false);
        return;
      }

      setUser(profile.username);

      const { data, error: statsError } =
        await supabase.rpc(
          "get_referral_stats"
        );

      if (statsError) {
        console.error(
          "Referral stats error:",
          statsError
        );

        setReferrals(0);
        setEarnings(0);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setReferrals(
          Number(data[0].total_referrals) || 0
        );

        setEarnings(
          Number(data[0].referral_earnings) || 0
        );
      }

      setLoading(false);

    } catch (error) {
      console.error(
        "Referral loading error:",
        error
      );

      setLoading(false);
    }
  }

  const referralLink =
    typeof window !== "undefined" && user
      ? `${window.location.origin}/register?ref=${encodeURIComponent(
          user
        )}`
      : "";

  async function copyLink() {
    if (copying || !referralLink) return;

    setCopying(true);

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 4000);

    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );

      alert(
        "Unable to copy the referral link."
      );
    } finally {
      setCopying(false);
    }
  }

  const progress = Math.min(
    (referrals / 5) * 100,
    100
  );

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>
          Loading your referrals... ⏳
        </h2>
      </main>
    );
  }

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)",
          color: "white",
          padding: "25px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            👥 Referral Center
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              marginTop: 0,
            }}
          >
            Invite friends and grow your
            EarnCapital network.
          </p>

          {/* STATISTICS */}

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
              <p
                style={{
                  margin: 0,
                  opacity: 0.85,
                }}
              >
                👥 Total Referrals
              </p>

              <h1
                style={{
                  margin: "10px 0 0",
                  fontSize: "36px",
                }}
              >
                {referrals}
              </h1>
            </div>

            <div
              style={{
                ...card,
                background:
                  "linear-gradient(135deg,#059669,#10b981)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  opacity: 0.85,
                }}
              >
                💰 Referral Earnings
              </p>

              <h1
                style={{
                  margin: "10px 0 0",
                  fontSize: "36px",
                }}
              >
                KES{" "}
                {earnings.toLocaleString()}
              </h1>
            </div>
          </div>

          {/* PROGRESS */}

          <div
            style={{
              marginTop: "25px",
              background: "#1e293b",
              padding: "22px",
              borderRadius: "18px",
              border:
                "1px solid #334155",
              boxShadow:
                "0 10px 25px rgba(0,0,0,.2)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              📈 Referral Progress
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                color: "#cbd5e1",
              }}
            >
              <span>
                {referrals} / 5 Referrals
              </span>

              <span>
                {Math.round(progress)}%
              </span>
            </div>

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
                  borderRadius: "10px",
                  transition:
                    "width .4s ease",
                }}
              />
            </div>

            {referrals >= 5 ? (
              <p
                style={{
                  color: "#22c55e",
                  marginTop: "15px",
                  fontWeight: "bold",
                }}
              >
                ✅ Withdrawal Requirement
                Unlocked
              </p>
            ) : (
              <p
                style={{
                  color: "#fbbf24",
                  marginTop: "15px",
                }}
              >
                Invite{" "}
                {5 - referrals} more{" "}
                {5 - referrals === 1
                  ? "friend"
                  : "friends"}{" "}
                to unlock withdrawals.
              </p>
            )}
          </div>

          {/* REFERRAL LINK */}

          <div
            style={{
              marginTop: "25px",
              background: "#1e293b",
              padding: "22px",
              borderRadius: "18px",
              border:
                "1px solid #334155",
              boxShadow:
                "0 10px 25px rgba(0,0,0,.2)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              🔗 Your Referral Link
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              Share this link with your
              friends to invite them to
              EarnCapital.
            </p>

            <input
              value={referralLink}
              readOnly
              onClick={(e) =>
                e.currentTarget.select()
              }
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "11px",
                border:
                  "1px solid #475569",
                marginTop: "10px",
                background: "#020617",
                color: "#cbd5e1",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "13px",
              }}
            />

            <button
              onClick={copyLink}
              disabled={copying}
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background: copying
                  ? "#475569"
                  : "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white",
                cursor: copying
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {copying
                ? "⏳ Copying..."
                : "📋 Copy Referral Link"}
            </button>
          </div>

          <button
            onClick={() =>
              (window.location.href =
                "/dashboard")
            }
            style={{
              marginTop: "25px",
              padding: "13px 22px",
              border: "none",
              borderRadius: "11px",
              background: "#334155",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← Back Dashboard
          </button>
        </div>
      </main>

      {/* PROFESSIONAL POPUP */}

      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            background:
              "rgba(2,6,23,.68)",
            backdropFilter:
              "blur(8px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#0f172a",
              borderRadius: "24px",
              padding: "28px",
              textAlign: "center",
              border:
                "1px solid rgba(59,130,246,.35)",
              boxShadow:
                "0 25px 70px rgba(0,0,0,.6)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                margin:
                  "0 auto 18px",
                borderRadius: "50%",
                background:
                  "rgba(34,197,94,.15)",
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                fontSize: "35px",
              }}
            >
              🎉
            </div>

            <h2
              style={{
                color: "white",
                margin:
                  "0 0 10px",
                fontSize: "25px",
              }}
            >
              Link Copied!
            </h2>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              Your referral link has
              been copied successfully.
              Share it with your friends
              and invite them to
              EarnCapital.
            </p>

            <div
              style={{
                marginTop: "18px",
                padding: "13px",
                borderRadius: "12px",
                background:
                  "rgba(59,130,246,.10)",
                color: "#93c5fd",
                fontSize: "13px",
                wordBreak:
                  "break-all",
              }}
            >
              {referralLink}
            </div>

            <button
              onClick={() =>
                setShowPopup(false)
              }
              style={{
                width: "100%",
                marginTop: "22px",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background:
                  "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Got It 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const card = {
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  padding: "20px",
  borderRadius: "18px",
  boxShadow:
    "0 10px 25px rgba(37,99,235,.25)",
};