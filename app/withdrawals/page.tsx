"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Withdrawal = {
  id: number;
  amount: number;
  method: string;
  account: string;
  status: string;
  created_at: string;
};

type ToastType = "success" | "error" | "info";

export default function WithdrawPage() {
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [balance, setBalance] = useState(0);
  const [feePaid, setFeePaid] = useState(false);

  const [totalReferrals, setTotalReferrals] = useState(0);
  const [activeReferrals, setActiveReferrals] = useState(0);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("M-Pesa");
  const [account, setAccount] = useState("");

  // Saved payment methods
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [mpesaName, setMpesaName] = useState("");

  const [paypalEmail, setPaypalEmail] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  const [history, setHistory] = useState<Withdrawal[]>([]);

  // Professional notification
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: "",
    type: "info",
  });

  function showToast(
    message: string,
    type: ToastType = "info"
  ) {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((current) => ({
        ...current,
        show: false,
      }));
    }, 3500);
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (method === "M-Pesa") {
      setAccount(
        `${mpesaNumber}${
          mpesaName ? " - " + mpesaName : ""
        }`
      );
    }

    if (method === "PayPal") {
      setAccount(paypalEmail);
    }

    if (method === "Bank") {
      setAccount(
        `${bankName} | ${bankAccount} | ${bankAccountName}`
      );
    }
  }, [
    method,
    mpesaNumber,
    mpesaName,
    paypalEmail,
    bankName,
    bankAccount,
    bankAccountName,
  ]);

  async function loadData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email);

      const currentUser =
        localStorage.getItem("currentUser") || "";

      setUsername(currentUser);

      const { data: me } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      if (me) {
        setBalance(Number(me.balance || 0));

        setFeePaid(
          me.fee_paid ?? me.is_activated ?? false
        );

        setMpesaNumber(me.mpesa_number || "");
        setMpesaName(me.mpesa_name || "");

        setPaypalEmail(me.paypal_email || "");

        setBankName(me.bank_name || "");
        setBankAccount(me.bank_account || "");
        setBankAccountName(
          me.bank_account_name || ""
        );
      }

      const { data: referrals } = await supabase
        .from("users")
        .select("fee_paid")
        .eq("referred_by", currentUser);

      if (referrals) {
        setTotalReferrals(referrals.length);

        setActiveReferrals(
          referrals.filter(
            (r: { fee_paid: boolean }) => r.fee_paid
          ).length
        );
      }

      const { data: withdrawals } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("username", currentUser)
        .order("created_at", {
          ascending: false,
        });

      if (withdrawals) {
        setHistory(withdrawals as Withdrawal[]);
      }
    } catch (error) {
      console.error(
        "Error loading withdrawal data:",
        error
      );

      showToast(
        "Unable to load your withdrawal information.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitWithdrawal() {
    const withdrawAmount = Number(amount);

    if (!feePaid) {
      showToast(
        "Your account must be activated before you can withdraw.",
        "error"
      );
      return;
    }

    if (!amount || !Number.isFinite(withdrawAmount)) {
      showToast(
        "Please enter a valid withdrawal amount.",
        "error"
      );
      return;
    }

    if (withdrawAmount < 1000) {
      showToast(
        "Minimum withdrawal is KES 1,000.",
        "error"
      );
      return;
    }

    if (withdrawAmount > balance) {
      showToast(
        "Insufficient wallet balance.",
        "error"
      );
      return;
    }

    if (totalReferrals < 5) {
      showToast(
        "Invite at least 5 friends before withdrawing.",
        "error"
      );
      return;
    }

    if (activeReferrals < 5) {
      showToast(
        "Your invited friends must activate their accounts.",
        "error"
      );
      return;
    }

    if (!account.trim()) {
      showToast(
        "No payment method found. Please save a payment method first.",
        "error"
      );
      return;
    }

    const { data: pending, error: pendingError } =
      await supabase
        .from("withdrawals")
        .select("id")
        .eq("username", username)
        .eq("status", "Pending");

    if (pendingError) {
      console.error(pendingError);

      showToast(
        "Unable to check your pending withdrawals.",
        "error"
      );
      return;
    }

    if (pending && pending.length > 0) {
      showToast(
        "You already have a pending withdrawal.",
        "error"
      );
      return;
    }

    const { data: newWithdrawal, error } =
      await supabase
        .from("withdrawals")
        .insert({
          username,
          amount: withdrawAmount,
          method,
          account,
          status: "Pending",
        })
        .select()
        .single();

    if (error) {
      console.error(error);

      showToast(
        error.message ||
          "Failed to submit withdrawal request.",
        "error"
      );
      return;
    }

    if (newWithdrawal) {
      setHistory((current) => [
        newWithdrawal as Withdrawal,
        ...current,
      ]);
    }

    showToast(
      `Withdrawal request of KES ${withdrawAmount.toLocaleString()} submitted successfully!`,
      "success"
    );

    setAmount("");
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#020617",
          color: "white",
          fontSize: "24px",
        }}
      >
        Loading Withdrawal Center...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
        padding: "30px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Professional Notification */}

      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 99999,
            width:
              "min(420px, calc(100vw - 32px))",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "20px",
            padding: "18px",
            boxShadow:
              "0 25px 60px rgba(0,0,0,.55), 0 0 30px rgba(59,130,246,.12)",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            overflow: "hidden",
            animation:
              "professionalToastIn .45s cubic-bezier(.21,1.02,.73,1)",
          }}
        >
          {/* Colored accent */}

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              background:
                toast.type === "success"
                  ? "#22c55e"
                  : toast.type === "error"
                  ? "#ef4444"
                  : "#3b82f6",
            }}
          />

          {/* Icon */}

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
                toast.type === "success"
                  ? "rgba(34,197,94,.15)"
                  : toast.type === "error"
                  ? "rgba(239,68,68,.15)"
                  : "rgba(59,130,246,.15)",
              color:
                toast.type === "success"
                  ? "#4ade80"
                  : toast.type === "error"
                  ? "#f87171"
                  : "#60a5fa",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {toast.type === "success"
              ? "✓"
              : toast.type === "error"
              ? "!"
              : "i"}
          </div>

          {/* Notification text */}

          <div
            style={{
              flex: 1,
              paddingTop: "2px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "white",
                marginBottom: "5px",
              }}
            >
              {toast.type === "success"
                ? "Withdrawal Submitted"
                : toast.type === "error"
                ? "Withdrawal Unsuccessful"
                : "Withdrawal Information"}
            </div>

            <div
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#94a3b8",
              }}
            >
              {toast.message}
            </div>
          </div>

          {/* Close button */}

          <button
            onClick={() =>
              setToast((current) => ({
                ...current,
                show: false,
              }))
            }
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              background: "#1e293b",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label="Close notification"
          >
            ×
          </button>

          {/* Progress bar */}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              width: "100%",
              background:
                toast.type === "success"
                  ? "#22c55e"
                  : toast.type === "error"
                  ? "#ef4444"
                  : "#3b82f6",
              transformOrigin: "left",
              animation:
                "toastProgress 3.5s linear forwards",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes professionalToastIn {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.96);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toastProgress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }

        @media (max-width: 600px) {
          .withdraw-toast {
            top: 14px !important;
            right: 16px !important;
            left: 16px !important;
            width: auto !important;
          }
        }
      `}</style>

      {/* Balance */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#4f46e5,#7c3aed)",
          borderRadius: "20px",
          padding: "25px",
          marginBottom: "25px",
          boxShadow:
            "0 15px 35px rgba(37,99,235,.35)",
        }}
      >
        <h3>Available Balance</h3>

        <h1
          style={{
            fontSize: "42px",
            marginTop: "10px",
          }}
        >
          KES {balance.toLocaleString()}
        </h1>

        <p>💎 Premium Withdrawal Center</p>
      </div>

      {/* Requirements */}

      <div
        style={{
          background: "#0f172a",
          borderRadius: "18px",
          padding: "20px",
          marginBottom: "25px",
          border: "1px solid #334155",
        }}
      >
        <h2>📋 Withdrawal Requirements</h2>

        <p>
          {feePaid ? "✅" : "❌"} Activated Account
        </p>

        <p>
          {balance >= 1000 ? "✅" : "❌"} Minimum Balance:
          KES 1,000
        </p>

        <p>
          {totalReferrals >= 5 ? "✅" : "❌"} Invite 5 Friends
          ({totalReferrals}/5)
        </p>

        <p>
          {activeReferrals >= 5 ? "✅" : "❌"} 5 Activated
          Referrals ({activeReferrals}/5)
        </p>
      </div>

      {/* Withdrawal Form */}

      <div
        style={{
          background: "#0f172a",
          borderRadius: "18px",
          padding: "20px",
          border: "1px solid #334155",
        }}
      >
        <h2>💸 Request Withdrawal</h2>

        <input
          type="number"
          min="1000"
          placeholder="Amount (KES)"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          style={input}
        />

        <select
          value={method}
          onChange={(e) =>
            setMethod(e.target.value)
          }
          style={input}
        >
          <option>M-Pesa</option>
          <option>PayPal</option>
          <option>Bank</option>
        </select>

        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#1e293b",
            borderRadius: "12px",
            border: "1px solid #334155",
          }}
        >
          {method === "M-Pesa" && (
            <>
              <p>
                <strong>📱 Number:</strong>{" "}
                {mpesaNumber || "Not saved"}
              </p>

              <p>
                <strong>👤 Name:</strong>{" "}
                {mpesaName || "Not saved"}
              </p>
            </>
          )}

          {method === "PayPal" && (
            <p>
              <strong>💵 Email:</strong>{" "}
              {paypalEmail || "Not saved"}
            </p>
          )}

          {method === "Bank" && (
            <>
              <p>
                <strong>🏦 Bank:</strong>{" "}
                {bankName || "Not saved"}
              </p>

              <p>
                <strong>💳 Account:</strong>{" "}
                {bankAccount || "Not saved"}
              </p>

              <p>
                <strong>👤 Name:</strong>{" "}
                {bankAccountName || "Not saved"}
              </p>
            </>
          )}
        </div>

        <button
          onClick={submitWithdrawal}
          style={button}
        >
          🚀 Submit Withdrawal
        </button>
      </div>

      {/* Withdrawal History */}

      <div style={{ marginTop: "35px" }}>
        <h2>📜 Withdrawal History</h2>

        {history.length === 0 ? (
          <p
            style={{
              color: "#94a3b8",
            }}
          >
            No withdrawals yet.
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                padding: "18px",
                marginTop: "15px",
                borderRadius: "15px",
              }}
            >
              <h3>
                KES{" "}
                {Number(
                  item.amount
                ).toLocaleString()}
              </h3>

              <p>Method: {item.method}</p>

              <p>Account: {item.account}</p>

              <p>
                Status:

                <span
                  style={{
                    marginLeft: "8px",
                    fontWeight: "bold",
                    color:
                      item.status === "Approved"
                        ? "#22c55e"
                        : item.status === "Rejected"
                        ? "#ef4444"
                        : "#facc15",
                  }}
                >
                  {item.status}
                </span>
              </p>

              <small>
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

const input = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#111827",
  color: "white",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};

const button = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  background:
    "linear-gradient(90deg,#2563eb,#7c3aed)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
};