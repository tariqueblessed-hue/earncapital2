"use client";

import { useEffect, useState } from "react";

type Withdrawal = {
  username: string;
  amount: number;
  status: string;
  date: string;
};

export default function WithdrawalsPage() {
  const [requests, setRequests] = useState<Withdrawal[]>([]);

  useEffect(() => {
    const savedRequests = JSON.parse(
      localStorage.getItem("withdrawRequests") || "[]"
    );

    setRequests(savedRequests);
  }, []);

  const updateStatus = (
    index: number,
    status: string
  ) => {
    const updated = [...requests];

    updated[index].status = status;

    setRequests(updated);

    localStorage.setItem(
      "withdrawRequests",
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
      <h1>💸 Withdrawal Requests</h1>

      {requests.length === 0 ? (
        <p>No withdrawal requests yet</p>
      ) : (
        requests.map((request, index) => (
          <div
            key={index}
            style={{
              background: "#1f2937",
              padding: "20px",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            <p>
              👤 User: {request.username}
            </p>

            <p>
              💰 Amount: KES {request.amount}
            </p>

            <p>
              📅 Date: {request.date}
            </p>

            <p>
              Status: {request.status}
            </p>

            <button
              onClick={() =>
                updateStatus(index, "Approved")
              }
              style={{
                padding: "10px",
                background: "green",
                color: "white",
                border: "none",
                marginRight: "10px",
                borderRadius: "8px",
              }}
            >
              Approve
            </button>

            <button
              onClick={() =>
                updateStatus(index, "Rejected")
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
          padding: "12px 24px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Back to Admin Dashboard
      </button>
    </main>
  );
}