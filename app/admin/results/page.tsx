"use client";

import { useEffect, useState } from "react";

type Result = {
  username: string;
  result: string;
  earnings: number;
  date: string;
};

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const savedResults = JSON.parse(
      localStorage.getItem("challengeResults") || "[]"
    );

    setResults(savedResults);
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
      <h1>📊 Challenge Results</h1>

      {results.length === 0 ? (
        <p>No challenge results yet</p>
      ) : (
        results.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#1f2937",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            <p>👤 User: {item.username}</p>
            <p>🧠 Result: {item.result}</p>
            <p>💰 Earnings: KES {item.earnings}</p>
            <p>📅 Date: {item.date}</p>
          </div>
        ))
      )}

      <button
        onClick={() =>
          (window.location.href = "/admin/dashboard")
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
        Back to Admin Dashboard
      </button>
    </main>
  );
}