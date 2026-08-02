"use client";

import { useEffect, useState } from "react";

export default function AdminPayments() {
  const [proofs, setProofs] = useState<any[]>([]);

  useEffect(() => {
    loadProofs();
  }, []);

  function loadProofs() {
    const saved = JSON.parse(
      localStorage.getItem("paymentProofs") || "[]"
    );

    setProofs(saved);
  }

  function approve(index: number) {
    const updated = [...proofs];

    if (updated[index].status === "Approved") {
      alert("Already approved.");
      return;
    }

    updated[index].status = "Approved";

    const username = updated[index].user;
    const amount = Number(updated[index].amount);

    const currentBalance =
      Number(
        localStorage.getItem(
          `balance_${username}`
        )
      ) || 0;

    localStorage.setItem(
      `balance_${username}`,
      String(currentBalance + amount)
    );

    const notifications = JSON.parse(
      localStorage.getItem(
        `notifications_${username}`
      ) || "[]"
    );

    notifications.unshift(
      `✅ Your payment of KES ${amount} has been approved.`
    );

    localStorage.setItem(
      `notifications_${username}`,
      JSON.stringify(notifications)
    );

    localStorage.setItem(
      "paymentProofs",
      JSON.stringify(updated)
    );

    setProofs(updated);

    alert(
      `${username} has been credited KES ${amount}.`
    );
  }

  function reject(index: number) {
    const updated = [...proofs];

    updated[index].status = "Rejected";

    localStorage.setItem(
      "paymentProofs",
      JSON.stringify(updated)
    );

    setProofs(updated);
  }

  return (
    <main
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <h1>💳 Payment Approvals</h1>

      {proofs.length === 0 ? (
        <p>No payment proofs found.</p>
      ) : (
        proofs.map((proof, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              marginTop: "20px",
              borderRadius: "15px",
              boxShadow:
                "0 5px 15px rgba(0,0,0,.1)",
            }}
          >
            <h3>👤 {proof.user}</h3>

            <p>
              <strong>Code:</strong> {proof.code}
            </p>

            <p>
              <strong>Amount:</strong> KES {proof.amount}
            </p>

            <p>
              <strong>Date:</strong> {proof.date}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {proof.status}
            </p>

            {proof.status === "Pending" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() => approve(index)}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#22c55e",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => reject(index)}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </main>
  );
}