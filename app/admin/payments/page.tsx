"use client";

import { useEffect, useState } from "react";

type Payment = {
  phone: string;
  transactionCode: string;
  status: string;
  date: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const savedPayments = JSON.parse(
      localStorage.getItem("payments") || "[]"
    );

    setPayments(savedPayments);
  }, []);

  const updatePayment = (
    index: number,
    status: string
  ) => {
    const updated = [...payments];

    updated[index].status = status;

    setPayments(updated);

    localStorage.setItem(
      "payments",
      JSON.stringify(updated)
    );
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
      <h1>💳 Payment Requests</h1>

      {payments.length === 0 ? (
        <p>No payment requests yet</p>
      ) : (
        payments.map((payment, index) => (
          <div
            key={index}
            style={{
              background: "#1f2937",
              padding: "20px",
              marginTop: "20px",
              borderRadius: "10px",
            }}
          >
            <p>📱 Phone: {payment.phone}</p>

            <p>
              🔑 Transaction Code:{" "}
              {payment.transactionCode}
            </p>

            <p>
              📅 Date: {payment.date}
            </p>

            <p>
              Status: {payment.status}
            </p>

            <button
              onClick={() =>
                updatePayment(index, "Approved")
              }
              style={{
                padding: "10px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            >
              Approve
            </button>

            <button
              onClick={() =>
                updatePayment(index, "Rejected")
              }
              style={{
                padding: "10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Reject
            </button>
          </div>
        ))
      )}

      <button
        onClick={() =>
          (window.location.href =
            "/admin/dashboard")
        }
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Back to Dashboard
      </button>
    </main>
  );
}