"use client";

import { useState } from "react";

export default function PaymentProofPage() {
  const [code, setCode] = useState("");

  function submitProof() {
    if (!code.trim()) {
      alert("Please enter your M-Pesa confirmation code.");
      return;
    }

    const currentUser =
      localStorage.getItem("currentUser") || "";

    if (!currentUser) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    const proofs = JSON.parse(
      localStorage.getItem("paymentProofs") || "[]"
    );

    proofs.push({
      user: currentUser,
      code,
      amount: 300,
      date: new Date().toLocaleString(),
      status: "Pending",
    });

    localStorage.setItem(
      "paymentProofs",
      JSON.stringify(proofs)
    );

    alert("✅ Payment proof submitted successfully.");

    setCode("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        background:
          "linear-gradient(135deg,#0f172a,#1e3a8a,#7c3aed)",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1>📄 Upload Payment Proof</h1>

      <p>
        Enter your M-Pesa confirmation code after making your payment.
      </p>

      <div
        style={{
          marginTop: "25px",
          background: "rgba(255,255,255,0.1)",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h3>Payment Details</h3>

        <p>Registration Fee: <strong>KES 300</strong></p>

        <p>M-Pesa Number:</p>

        <h2>07XXXXXXXX</h2>

        <p>Name: EarnCapital</p>
      </div>

      <input
        type="text"
        placeholder="Enter M-Pesa Confirmation Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "30px",
          borderRadius: "10px",
          border: "none",
          fontSize: "16px",
        }}
      />

      <button
        onClick={submitProof}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "15px",
          border: "none",
          borderRadius: "10px",
          background: "#22c55e",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ✅ Submit Payment Proof
      </button>
    </main>
  );
}