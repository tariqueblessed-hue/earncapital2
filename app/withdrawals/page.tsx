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

const [mpesaNumber, setMpesaNumber] = useState("");
const [mpesaName, setMpesaName] = useState("");

const [paypalEmail, setPaypalEmail] = useState("");

const [bankName, setBankName] = useState("");
const [bankAccount, setBankAccount] = useState("");
const [bankAccountName, setBankAccountName] = useState("");

  const [history, setHistory] = useState<Withdrawal[]>([]);

  useEffect(() => {
    loadData();
  }, []);
useEffect(() => {
  if (method === "M-Pesa") {
    setAccount(
      `${mpesaNumber}${mpesaName ? " - " + mpesaName : ""}`
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

   if (!user.email) {
  alert("User email not found.");
  return;
}

setEmail(user.email ?? "");

    const currentUser =
      localStorage.getItem("currentUser") || "";

    setUsername(currentUser);

    // Load user

    const { data: me } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (me) {

      setBalance(Number(me.balance || 0));

      setFeePaid(me.fee_paid);

    }

    // Load referrals

    const { data: referrals } = await supabase
      .from("users")
      .select("fee_paid")
      .eq("referred_by", currentUser);

    if (referrals) {

      setTotalReferrals(referrals.length);

      setActiveReferrals(
        referrals.filter(r => r.fee_paid).length
      );

    }

    // Withdrawal history

    const { data: withdrawals } =
      await supabase
        .from("withdrawals")
        .select("*")
        .eq("username", currentUser)
        .order("created_at", {
          ascending: false,
        });

    if (withdrawals) {
      setHistory(withdrawals as Withdrawal[]);
    }

    setLoading(false);

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
  }async function submitWithdrawal() {

  const withdrawAmount = Number(amount);

  // Account activated?
  if (!feePaid) {
    alert(
      "❌ Your account must be activated before you can withdraw."
    );
    return;
  }

  // Minimum withdrawal
  if (withdrawAmount < 1000) {
    alert(
      "❌ Minimum withdrawal is KES 1,000."
    );
    return;
  }

  // Enough balance?
  if (withdrawAmount > balance) {
    alert(
      "❌ Insufficient wallet balance."
    );
    return;
  }

  // Referral requirement
  if (totalReferrals < 5) {
    alert(
      "❌ Invite at least 5 friends before withdrawing."
    );
    return;
  }

  // Activated referrals
  if (activeReferrals < 5) {
    alert(
      "❌ Your 5 invited friends must activate their accounts."
    );
    return;
  }

  if (account.trim() === "") {
    alert(
      "❌ Enter your payment details."
    );
    return;
  }

  // Prevent multiple pending withdrawals
  const { data: pending } = await supabase
    .from("withdrawals")
    .select("id")
    .eq("username", username)
    .eq("status", "Pending");

  if (pending && pending.length > 0) {
    alert(
      "❌ You already have a pending withdrawal request."
    );
    return;
  }

  const { error } = await supabase
    .from("withdrawals")
    .insert({
      username,
      amount: withdrawAmount,
      method,
      account,
      status: "Pending",
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert(
    "✅ Withdrawal request submitted successfully."
  );

  setAmount("");
  setAccount("");

  loadData();

}return (
  <main
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
      padding: "30px",
      color: "white",
      fontFamily: "Arial",
    }}
  >
    {/* Premium Wallet Card */}

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

      <p>{feePaid ? "✅" : "❌"} Activated Account</p>

      <p>
        {balance >= 1000 ? "✅" : "❌"} Minimum
        Balance: KES 1,000
      </p>

      <p>
        {totalReferrals >= 5 ? "✅" : "❌"} Invite
        5 Friends ({totalReferrals}/5)
      </p>

      <p>
        {activeReferrals >= 5 ? "✅" : "❌"} 5
        Activated Referrals ({activeReferrals}/5)
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
        placeholder="Amount (KES)"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "15px",
          borderRadius: "10px",
        }}
      />

      <select
        value={method}
        onChange={(e) =>
          setMethod(e.target.value)
        }
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "15px",
          borderRadius: "10px",
        }}
      >
        <option>M-Pesa</option>
        <option>PayPal</option>
        <option>Bank</option>
      </select>

     
   <div
  style={{
    marginTop: "15px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "16px",
  }}
>
  {method === "M-Pesa" && (
    <>
      <p><strong>📱 M-Pesa Number:</strong> {mpesaNumber || "Not saved"}</p>
      <p><strong>👤 Account Name:</strong> {mpesaName || "Not saved"}</p>
    </>
  )}

  {method === "PayPal" && (
    <>
      <p><strong>💵 PayPal Email:</strong> {paypalEmail || "Not saved"}</p>
    </>
  )}

  {method === "Bank" && (
    <>
      <p><strong>🏦 Bank:</strong> {bankName || "Not saved"}</p>
      <p><strong>💳 Account Number:</strong> {bankAccount || "Not saved"}</p>
      <p><strong>👤 Account Name:</strong> {bankAccountName || "Not saved"}</p>
    </>
  )}
</div>

      <button
        onClick={submitWithdrawal}
        style={{
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
        }}
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
              KES {Number(item.amount).toLocaleString()}
            </h3>

            <p>Method: {item.method}</p>

            <p>Account: {item.account}</p>

            <p>
              Status:
              <span
                style={{
                  color:
                    item.status === "Approved"
                      ? "#22c55e"
                      : item.status === "Rejected"
                      ? "#ef4444"
                      : "#facc15",
                  fontWeight: "bold",
                  marginLeft: "8px",
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