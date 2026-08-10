"use client";

import { useEffect, useState } from "react";

type DailyRewardProps = {
  username: string;
};

type PopupType = "success" | "info" | "error";

export default function DailyReward({
  username,
}: DailyRewardProps) {
  const REWARD = 50;

  const [claimedToday, setClaimedToday] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] =
    useState<PopupType>("success");
  const [popupTitle, setPopupTitle] = useState("");
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

  function showNotification(
    type: PopupType,
    title: string,
    message: string
  ) {
    setPopupType(type);
    setPopupTitle(title);
    setPopupMessage(message);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 4000);
  }

  function claimReward() {
    if (!username) {
      showNotification(
        "error",
        "Unable to Claim",
        "We could not identify your account. Please log in again."
      );
      return;
    }

    if (claimedToday) {
      showNotification(
        "info",
        "Reward Already Claimed",
        "You have already claimed today's KES 50 reward. Come back tomorrow!"
      );
      return;
    }

    const today = new Date().toDateString();

    const balance =
      Number(
        localStorage.getItem(`balance_${username}`)
      ) || 0;

    const newBalance = balance + REWARD;

    localStorage.setItem(
      `balance_${username}`,
      newBalance.toString()
    );

    localStorage.setItem(
      `dailyReward_${username}`,
      today
    );

    /* -----------------------------
       SAVE TRANSACTION
    ----------------------------- */

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

    /* -----------------------------
       SAVE NOTIFICATION
    ----------------------------- */

    const notifications = JSON.parse(
      localStorage.getItem(
        `notifications_${username}`
      ) || "[]"
    );

    notifications.unshift({
      title: "🎁 Daily Reward",
      message: `You received KES ${REWARD} daily reward.`,
      date: new Date().toLocaleString(),
      created_at: new Date().toISOString(),
    });

    localStorage.setItem(
      `notifications_${username}`,
      JSON.stringify(notifications)
    );

    setClaimedToday(true);

    showNotification(
      "success",
      "🎉 Reward Claimed Successfully!",
      `KES ${REWARD} has been added to your EarnCapital wallet. Keep earning!`
    );

    /*
      Refresh after the popup has been displayed.
      This allows the dashboard balance to update.
    */
    setTimeout(() => {
      window.location.reload();
    }, 4200);
  }

  return (
    <>
      {/* Daily Reward Card */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#111827,#1e293b)",
          borderRadius: "20px",
          padding: "24px",
          marginTop: "24px",
          border: "1px solid #334155",
          boxShadow:
            "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
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
                marginTop: "8px",
                marginBottom: 0,
              }}
            >
              Claim your daily reward and keep
              growing your wallet.
            </p>
          </div>

          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg,#f59e0b,#f97316)",
              fontSize: "27px",
              flexShrink: 0,
            }}
          >
            🎁
          </div>
        </div>

        <div
          style={{
            marginTop: "22px",
            background: "#020617",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #334155",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Today's Reward
          </p>

          <h1
            style={{
              color: "#22c55e",
              margin: "8px 0",
              fontSize: "36px",
              fontWeight: "800",
            }}
          >
            KES {REWARD}
          </h1>

          <p
            style={{
              color: "#64748b",
              margin: 0,
              fontSize: "13px",
            }}
          >
            Available once every 24 hours
          </p>
        </div>

        <button
          onClick={claimReward}
          disabled={claimedToday}
          style={{
            width: "100%",
            marginTop: "18px",
            padding: "15px",
            border: "none",
            borderRadius: "14px",
            background: claimedToday
              ? "#475569"
              : "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white",
            cursor: claimedToday
              ? "not-allowed"
              : "pointer",
            fontWeight: "800",
            fontSize: "16px",
            boxShadow: claimedToday
              ? "none"
              : "0 8px 20px rgba(37,99,235,.25)",
          }}
        >
          {claimedToday
            ? "✅ Reward Claimed Today"
            : "🎁 Claim KES 50"}
        </button>

        {claimedToday && (
          <p
            style={{
              color: "#94a3b8",
              textAlign: "center",
              marginTop: "12px",
              marginBottom: 0,
              fontSize: "13px",
            }}
          >
            Your next KES 50 reward will be available
            tomorrow.
          </p>
        )}
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
            zIndex: 99999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "25px",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "430px",
              marginTop: "20px",
              background: "#0f172a",
              borderRadius: "20px",
              border:
                popupType === "success"
                  ? "1px solid #22c55e"
                  : popupType === "error"
                  ? "1px solid #ef4444"
                  : "1px solid #3b82f6",
              boxShadow:
                "0 20px 60px rgba(0,0,0,.55)",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                minWidth: "52px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                background:
                  popupType === "success"
                    ? "rgba(34,197,94,.15)"
                    : popupType === "error"
                    ? "rgba(239,68,68,.15)"
                    : "rgba(59,130,246,.15)",
              }}
            >
              {popupType === "success"
                ? "✓"
                : popupType === "error"
                ? "!"
                : "ℹ"}
            </div>

            <div style={{ flex: 1 }}>
              <h3
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: "800",
                }}
              >
                {popupTitle}
              </h3>

              <p
                style={{
                  color: "#94a3b8",
                  margin:
                    "6px 0 0 0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {popupMessage}
              </p>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
              }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}