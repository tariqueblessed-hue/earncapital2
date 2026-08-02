"use client";

export default function StatsGrid({
  balance,
  referrals,
}: {
  balance: number;
  referrals: number;
}) {
  const cardStyle = {
    background: "rgba(255,255,255,.08)",
    borderRadius: "18px",
    padding: "20px",
    color: "white",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,.1)",
    textAlign: "center" as const,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(180px,1fr))",
        gap: "15px",
        marginTop: "25px",
      }}
    >
      <div style={cardStyle}>
        <h3>👥 Referrals</h3>
        <h1>{referrals}</h1>
      </div>

      <div style={cardStyle}>
        <h3>💰 Earnings</h3>
        <h1>KES {balance}</h1>
      </div>

      <div style={cardStyle}>
        <h3>🏆 Rank</h3>
        <h1>Gold</h1>
      </div>

      <div style={cardStyle}>
        <h3>🎁 Daily Reward</h3>
        <h1>Ready</h1>
      </div>
    </div>
  );
}