"use client";

export default function BalanceCard({
  balance,
}: {
  balance: number;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#2563eb,#7c3aed)",
        borderRadius: "20px",
        padding: "25px",
        color: "white",
        boxShadow: "0 15px 35px rgba(0,0,0,.3)",
      }}
    >
      <p
        style={{
          opacity: 0.9,
          marginBottom: "10px",
        }}
      >
        💰 Total Balance
      </p>

      <h1
        style={{
          fontSize: "42px",
          margin: 0,
        }}
      >
        KES {balance}
      </h1>

      <p
        style={{
          marginTop: "10px",
          opacity: 0.9,
        }}
      >
        Available for withdrawal
      </p>
    </div>
  );
}