"use client";

import { useState } from "react";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [mpesa, setMpesa] = useState("");

  const submitWithdrawal = () => {
    const user =
      localStorage.getItem("currentUser") || "";

    const balance =
      Number(
        localStorage.getItem(
          `balance_${user}`
        )
      ) || 0;

    const withdrawAmount =
      Number(amount);

    if (!amount || !mpesa) {
      alert("Fill all fields");
      return;
    }

    if (withdrawAmount <= 0) {
      alert("Invalid amount");
      return;
    }

    if (withdrawAmount > balance) {
      alert(
        "❌ Insufficient balance"
      );
      return;
    }

    const requests = JSON.parse(
      localStorage.getItem(
        "withdrawRequests"
      ) || "[]"
    );

    requests.unshift({
      username: user,
      amount: withdrawAmount,
      mpesa,
      status: "Pending",
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "withdrawRequests",
      JSON.stringify(requests)
    );

    localStorage.setItem(
      `balance_${user}`,
      (
        balance - withdrawAmount
      ).toString()
    );

    alert(
      "✅ Withdrawal request submitted"
    );

    setAmount("");
    setMpesa("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>💸 Withdraw Funds</h1>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
        }}
      />

      <input
        type="text"
        placeholder="M-Pesa Number"
        value={mpesa}
        onChange={(e) =>
          setMpesa(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
        }}
      />

      <button
        onClick={submitWithdrawal}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Submit Withdrawal
      </button>
    </main>
  );
}