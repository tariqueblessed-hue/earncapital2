"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const user =
      localStorage.getItem("currentUser") || "";

    const history = JSON.parse(
      localStorage.getItem(
        `transactions_${user}`
      ) || "[]"
    );

    setTransactions(history);
  }, []);

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
      <h1>📜 Transaction History</h1>

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        transactions.map(
          (item, index) => (
            <div
              key={index}
              style={{
                background:
                  "#1f2937",
                padding: "15px",
                borderRadius:
                  "10px",
                marginTop: "10px",
              }}
            >
              <p>
                {item.description}
              </p>

              <p>
                Amount: KES{" "}
                {item.amount}
              </p>

              <p>
                Date: {item.date}
              </p>
            </div>
          )
        )
      )}

      <button
        onClick={() =>
          (window.location.href =
            "/")
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