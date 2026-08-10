"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DailyRewardProps = {
username: string;
};

type PopupType = "success" | "already" | "error";

export default function DailyReward({
username,
}: DailyRewardProps) {
const REWARD = 50;

const [claimedToday, setClaimedToday] = useState(false);
const [loading, setLoading] = useState(false);

const [showPopup, setShowPopup] = useState(false);
const [popupType, setPopupType] =
useState<PopupType>("success");

const [popupMessage, setPopupMessage] = useState("");

useEffect(() => {
if (!username) return;

const today = new Date().toDateString();

const lastClaim = localStorage.getItem(
  `dailyReward_${username}`
);

if (lastClaim === today) {
  setClaimedToday(true);
} else {
  setClaimedToday(false);
}

}, [username]);

function showProfessionalPopup(
type: PopupType,
message: string
) {
setPopupType(type);
setPopupMessage(message);
setShowPopup(true);

setTimeout(() => {
  setShowPopup(false);
}, 4000);

}

async function claimReward() {
if (loading) return;

if (claimedToday) {
  showProfessionalPopup(
    "already",
    "You have already claimed today's reward. Come back tomorrow!"
  );
  return;
}

if (!username) {
  showProfessionalPopup(
    "error",
    "Unable to identify your account. Please log in again."
  );
  return;
}

setLoading(true);

try {
  const today = new Date().toDateString();

  /*
   * Get the currently logged-in Supabase user.
   */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    throw new Error(
      "Your session has expired. Please log in again."
    );
  }

  /*
   * Get the user's current wallet balance
   * directly from Supabase.
   */
  const { data: profile, error: profileError } =
    await supabase
      .from("users")
      .select("balance, username")
      .eq("email", user.email)
      .single();

  if (profileError || !profile) {
    throw new Error(
      "Unable to find your wallet account."
    );
  }

  const currentBalance = Number(
    profile.balance || 0
  );

  const newBalance =
    currentBalance + REWARD;

  /*
   * IMPORTANT:
   * Update the REAL wallet balance in Supabase.
   */
  const { error: balanceError } =
    await supabase
      .from("users")
      .update({
        balance: newBalance,
      })
      .eq("email", user.email);

  if (balanceError) {
    throw new Error(
      "Your wallet could not be updated. Please try again."
    );
  }

  /*
   * Save daily claim locally so the user
   * cannot claim twice on the same device today.
   */
  localStorage.setItem(
    `dailyReward_${username}`,
    today
  );

  /*
   * Keep the local balance synchronized too.
   */
  localStorage.setItem(
    `balance_${username}`,
    newBalance.toString()
  );

  /*
   * Save transaction history.
   */
  const transactions = JSON.parse(
    localStorage.getItem(
      `transactions_${username}`
    ) || "[]"
  );

  transactions.unshift({
    type: "Daily Reward",
    amount: REWARD,
    status: "Completed",
    date: new Date().toLocaleString(),
    created_at: new Date().toISOString(),
  });

  localStorage.setItem(
    `transactions_${username}`,
    JSON.stringify(transactions)
  );

  /*
   * Save notification.
   */
  const notifications = JSON.parse(
    localStorage.getItem(
      `notifications_${username}`
    ) || "[]"
  );

  notifications.unshift({
    title: "🎉 Daily Reward",
    message: `You received KES ${REWARD} daily reward.`,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem(
    `notifications_${username}`,
    JSON.stringify(notifications)
  );

  /*
   * Update UI.
   */
  setClaimedToday(true);

  showProfessionalPopup(
    "success",
    `KES ${REWARD} has been added to your wallet successfully!`
  );

  /*
   * Give WalletCard a moment to detect
   * the updated Supabase balance.
   */
  window.dispatchEvent(
    new Event("walletBalanceUpdated")
  );
} catch (error) {
  console.error("Daily reward error:", error);

  showProfessionalPopup(
    "error",
    error instanceof Error
      ? error.message
      : "Something went wrong while claiming your reward."
  );
} finally {
  setLoading(false);
}

}

return (
<>
{/* Daily Reward Card */}

  <div
    style={{
      background:
        "linear-gradient(135deg,#111827,#1e293b)",
      borderRadius: "20px",
      padding: "22px",
      marginTop: "24px",
      border: "1px solid #334155",
      boxShadow:
        "0 12px 30px rgba(0,0,0,.25)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Decorative glow */}

    <div
      style={{
        position: "absolute",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background:
          "rgba(59,130,246,.15)",
        right: "-40px",
        top: "-40px",
        filter: "blur(10px)",
      }}
    />

    <div
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
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
              margin: 0,
              fontSize: "22px",
            }}
          >
            🎁 Daily Reward
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "7px",
              marginBottom: 0,
            }}
          >
            Claim your daily reward and grow
            your wallet.
          </p>
        </div>

        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "15px",
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "25px",
            boxShadow:
              "0 8px 20px rgba(37,99,235,.3)",
          }}
        >
          🎁
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "18px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg,#064e3b,#065f46)",
          border:
            "1px solid rgba(34,197,94,.25)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#a7f3d0",
            fontSize: "13px",
          }}
        >
          TODAY'S REWARD
        </p>

        <h1
          style={{
            margin: "5px 0 0",
            color: "#22c55e",
            fontSize: "34px",
          }}
        >
          KES {REWARD}
        </h1>
      </div>

      <button
        onClick={claimReward}
        disabled={claimedToday || loading}
        style={{
          width: "100%",
          marginTop: "18px",
          padding: "15px",
          border: "none",
          borderRadius: "13px",
          background:
            claimedToday
              ? "#475569"
              : loading
              ? "#475569"
              : "linear-gradient(90deg,#2563eb,#7c3aed)",
          color: "white",
          cursor:
            claimedToday || loading
              ? "not-allowed"
              : "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          boxShadow:
            claimedToday || loading
              ? "none"
              : "0 8px 20px rgba(37,99,235,.25)",
          transition: "all .2s ease",
        }}
      >
        {loading
          ? "⏳ Processing Reward..."
          : claimedToday
          ? "✅ Claimed Today"
          : "🎁 Claim KES 50"}
      </button>

      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: "12px",
          marginTop: "12px",
          marginBottom: 0,
        }}
      >
        One reward available every 24 hours.
      </p>
    </div>
  </div>

  {/* Professional Popup */}

  {showPopup && (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background:
          "rgba(2,6,23,.65)",
        backdropFilter: "blur(7px)",
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
            popupType === "success"
              ? "1px solid rgba(34,197,94,.35)"
              : popupType === "error"
              ? "1px solid rgba(239,68,68,.35)"
              : "1px solid rgba(250,204,21,.35)",
          boxShadow:
            "0 25px 70px rgba(0,0,0,.55)",
          animation:
            "rewardPopup .25s ease-out",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            margin: "0 auto 18px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "34px",
            background:
              popupType === "success"
                ? "rgba(34,197,94,.15)"
                : popupType === "error"
                ? "rgba(239,68,68,.15)"
                : "rgba(250,204,21,.15)",
          }}
        >
          {popupType === "success"
            ? "🎉"
            : popupType === "error"
            ? "⚠️"
            : "⏳"}
        </div>

        <h2
          style={{
            color: "white",
            margin: "0 0 10px",
            fontSize: "24px",
          }}
        >
          {popupType === "success"
            ? "Reward Claimed!"
            : popupType === "error"
            ? "Something Went Wrong"
            : "Already Claimed"}
        </h2>

        <p
          style={{
            color: "#94a3b8",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {popupMessage}
        </p>

        {popupType === "success" && (
          <div
            style={{
              marginTop: "20px",
              padding: "13px",
              borderRadius: "12px",
              background:
                "rgba(34,197,94,.1)",
              color: "#4ade80",
              fontWeight: "bold",
            }}
          >
            💰 +KES {REWARD} added to wallet
          </div>
        )}

        <button
          onClick={() => setShowPopup(false)}
          style={{
            width: "100%",
            marginTop: "22px",
            padding: "13px",
            border: "none",
            borderRadius: "12px",
            background:
              popupType === "success"
                ? "linear-gradient(90deg,#16a34a,#22c55e)"
                : "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {popupType === "success"
            ? "Awesome! 🎉"
            : "Close"}
        </button>
      </div>
    </div>
  )}

  <style jsx>{`
    @keyframes rewardPopup {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(15px);
      }

      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `}</style>
</>

);
}