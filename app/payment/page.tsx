"use client";

import { useState } from "react";

export default function PaymentPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const submitPayment = () => {
    if (!phone || !code) {
      alert("Please enter M-Pesa phone number and transaction code");
      return;
    }

    const payments = JSON.parse(
      localStorage.getItem("payments") || "[]"
    );

    payments.push({
      phone: phone,
      transactionCode: code,
      status: "Pending",
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "payments",
      JSON.stringify(payments)
    );

    alert("Payment submitted. Waiting for approval.");

    setPhone("");
    setCode("");
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
      <h1>💳 Challenge Payment</h1>

      <h2>Pay KES 500</h2>

      <div
        style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <p>
          Send payment via M-Pesa
        </p>

        <h3>
          Payment Number: 0143390270
        </h3>
      </div>

      <input
        type="text"
        placeholder="Your M-Pesa Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
        }}
      />

      <input
        type="text"
        placeholder="M-Pesa Transaction Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
        }}
      />

      <button
        onClick={submitPayment}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Submit Payment
      </button>
    </main>
  );
}