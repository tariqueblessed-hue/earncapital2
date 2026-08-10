"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const REWARD_AMOUNT = 50;
const REWARD_COOLDOWN = 24 * 60 * 60 * 1000;

export default function DailyRewardPage() {
const [canClaim, setCanClaim] = useState(false);
const [message, setMessage] = useState("");
const [popupTitle, setPopupTitle] = useState("");
const [showPopup, setShowPopup] = useState(false);
const [claiming, setClaiming] = useState(false);

useEffect(() => {
checkReward();
}, []);

function checkReward() {
const user =
localStorage.getItem("currentUser") || "";

if (!user) {
  setCanClaim(false);
  return;
}

const lastClaim = localStorage.getItem(
  `lastClaim_${user}`
);

if (!lastClaim) {
  setCanClaim(true);
  return;
}

const difference =
  Date.now() - Number(lastClaim);

setCanClaim(difference >= REWARD_COOLDOWN);

}

function showNotification(
title: string,
text: string
) {
setPopupTitle(title);
setMessage(text);
setShowPopup(true);

setTimeout(() => {
  setShowPopup(false);
}, 4000);

}

async function claimReward() {
if (claiming) return;

const user =
  localStorage.getItem("currentUser") || "";

if (!user) {
  showNotification(
    "Login Required",
    "Please log in before claiming your daily reward."
  );
  return;
}

const lastClaim = localStorage.getItem(
  `lastClaim_${user}`
);

if (
  lastClaim &&
  Date.now() - Number(lastClaim) <
    REWARD_COOLDOWN
) {
  setCanClaim(false);

  showNotification(
    "Reward Already Claimed",
    "Your next KES 50 reward will be available after 24 hours."
  );

  return;
}

setClaiming(true);

try {
  /*
   * Get authenticated Supabase user
   */
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser?.email) {
    showNotification(
      "Authentication Required",
      "We couldn't verify your account. Please log in again."
    );

    setClaiming(false);
    return;
  }

  /*
   * Get current wallet balance
   */
  const { data: profile, error: profileError } =
    await supabase
      .from("users")
      .select("balance")
      .eq("email", authUser.email)
      .single();

  if (profileError || !profile) {
    console.error(profileError);

    showNotification(
      "Reward Failed",
      "We couldn't load your wallet. Please try again."
    );

    setClaiming(false);
    return;
  }

  const currentBalance =
    Number(profile.balance || 0);

  const newBalance =
    currentBalance + REWARD_AMOUNT;

  /*
   * Update REAL Supabase wallet balance
   */
  const { error: balanceError } =
    await supabase
      .from("users")
      .update({
        balance: newBalance,
      })
      .eq("email", authUser.email);

  if (balanceError) {
    console.error(balanceError);

    showNotification(
      "Reward Failed",
      "Your wallet could not be updated. Please try again."
    );

    setClaiming(false);
    return;
  }

  /*
   * Keep localStorage balance synchronized
   */
  localStorage.setItem(
    `balance_${user}`,
    newBalance.toString()
  );

  /*
   * Save claim time
   */
  localStorage.setItem(
    `lastClaim_${user}`,
    Date.now().toString()
  );

  /*
   * Save transaction history
   */
  const transactions = JSON.parse(
    localStorage.getItem(
      `transactions_${user}`
    ) || "[]"
  );

  transactions.unshift({
    description: "🎁 Daily Reward",
    amount: REWARD_AMOUNT,
    type: "credit",
    date: new Date().toLocaleString(),
  });

  localStorage.setItem(
    `transactions_${user}`,
    JSON.stringify(transactions)
  );

  /*
   * Save notification history
   */
  const notifications = JSON.parse(
    localStorage.getItem(
      `notifications_${user}`
    ) || "[]"
  );

  notifications.unshift({
    message:
      "🎁 Daily Reward Claimed (+KES 50)",
    date: new Date().toLocaleString(),
    type: "success",
  });

  localStorage.setItem(
    `notifications_${user}`,
    JSON.stringify(notifications)
  );

  setCanClaim(false);

  showNotification(
    "🎉 Reward Claimed Successfully!",
    "KES 50 has been added to your wallet."
  );
} catch (error) {
  console.error(error);

  showNotification(
    "Something Went Wrong",
    "We couldn't process your reward. Please try again."
  );
}

setClaiming(false);

}

return (
<main
style={{
minHeight: "100vh",
background:
"linear-gradient(135deg,#020617,#111827,#312e81)",
color: "white",
padding: "30px",
fontFamily: "Arial, sans-serif",
}}
>
{/* PROFESSIONAL POPUP */}

  {showPopup && (
    <div
      style={{
        position: "fixed",
        top: "25px",
        right: "25px",
        zIndex: 9999,
        width:
          "min(390px, calc(100vw - 40px))",
        background:
          "linear-gradient(135deg,#111827,#1e293b)",
        border:
          "1px solid rgba(255,255,255,.12)",
        borderRadius: "18px",
        padding: "18px",
        boxShadow:
          "0 20px 50px rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        animation:
          "rewardPopup .35s ease-out",
      }}
    >
      <div
        style={{
          width: "46px",
          height: "46px",
          minWidth: "46px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg,#22c55e,#16a34a)",
          fontSize: "22px",
          boxShadow:
            "0 8px 20px rgba(34,197,94,.25)",
        }}
      >
        🎁
      </div>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: "17px",
          }}
        >
          {popupTitle}
        </h3>

        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>
      </div>

      <button
        onClick={() => setShowPopup(false)}
        style={{
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          fontSize: "20px",
          cursor: "pointer",
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  )}

  <style jsx>{`
    @keyframes rewardPopup {
      from {
        opacity: 0;
        transform: translateY(-15px)
          translateX(15px);
      }

      to {
        opacity: 1;
        transform: translateY(0)
          translateX(0);
      }
    }
  `}</style>

  <div
    style={{
      maxWidth: "700px",
      margin: "0 auto",
    }}
  >
    {/* HEADER */}

    <div
      style={{
        textAlign: "center",
        marginBottom: "30px",
      }}
    >
      <div
        style={{
          fontSize: "55px",
          marginBottom: "10px",
        }}
      >
        🎁
      </div>

      <h1
        style={{
          fontSize: "36px",
          margin: 0,
          fontWeight: "bold",
        }}
      >
        Daily Reward
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginTop: "10px",
        }}
      >
        Come back every 24 hours and claim
        your daily KES 50 reward.
      </p>
    </div>

    {/* REWARD CARD */}

    <div
      style={{
        background:
          "linear-gradient(135deg,#2563eb,#7c3aed)",
        borderRadius: "24px",
        padding: "35px 25px",
        textAlign: "center",
        boxShadow:
          "0 20px 50px rgba(37,99,235,.3)",
        marginBottom: "25px",
      }}
    >
      <p
        style={{
          color: "#dbeafe",
          margin: 0,
          fontSize: "15px",
          letterSpacing: "1px",
        }}
      >
        TODAY'S REWARD
      </p>

      <h2
        style={{
          fontSize: "52px",
          margin: "10px 0",
        }}
      >
        KES 50
      </h2>

      <p
        style={{
          color: "#e0e7ff",
          marginBottom: "25px",
        }}
      >
        Your daily bonus is waiting for you.
      </p>

      {canClaim ? (
        <button
          onClick={claimReward}
          disabled={claiming}
          style={{
            width: "100%",
            maxWidth: "350px",
            padding: "16px 25px",
            background: claiming
              ? "#64748b"
              : "linear-gradient(90deg,#22c55e,#16a34a)",
            color: "white",
            border: "none",
            borderRadius: "14px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: claiming
              ? "not-allowed"
              : "pointer",
            boxShadow:
              "0 10px 25px rgba(0,0,0,.2)",
          }}
        >
          {claiming
            ? "Processing Reward..."
            : "🎁 Claim KES 50"}
        </button>
      ) : (
        <div
          style={{
            background:
              "rgba(15,23,42,.35)",
            padding: "16px",
            borderRadius: "14px",
            color: "#e2e8f0",
          }}
        >
          ⏳ Reward already claimed.
          <br />

          <span
            style={{
              fontSize: "14px",
              color: "#cbd5e1",
            }}
          >
            Come back after 24 hours.
          </span>
        </div>
      )}
    </div>

    {/* HOW IT WORKS */}

    <div
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "20px",
        padding: "25px",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          fontSize: "20px",
        }}
      >
        💎 How Daily Rewards Work
      </h2>

      <div
        style={{
          display: "grid",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "#111827",
            padding: "15px",
            borderRadius: "12px",
          }}
        >
          🎁{" "}
          <strong>
            Claim KES 50
          </strong>

          <p
            style={{
              color: "#94a3b8",
              margin:
                "6px 0 0 25px",
            }}
          >
            Claim your daily KES 50
            reward once every 24 hours.
          </p>
        </div>

        <div
          style={{
            background: "#111827",
            padding: "15px",
            borderRadius: "12px",
          }}
        >
          💰{" "}
          <strong>
            Instant Wallet Credit
          </strong>

          <p
            style={{
              color: "#94a3b8",
              margin:
                "6px 0 0 25px",
            }}
          >
            Your KES 50 is added directly
            to your wallet.
          </p>
        </div>

        <div
          style={{
            background: "#111827",
            padding: "15px",
            borderRadius: "12px",
          }}
        >
          🔄{" "}
          <strong>
            Come Back Tomorrow
          </strong>

          <p
            style={{
              color: "#94a3b8",
              margin:
                "6px 0 0 25px",
            }}
          >
            After 24 hours, you can claim
            another KES 50 reward.
          </p>
        </div>
      </div>
    </div>
  </div>
</main>

);
}