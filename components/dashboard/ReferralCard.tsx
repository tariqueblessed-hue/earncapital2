"use client";

type ReferralCardProps = {
  username: string;
};

export default function ReferralCard({
  username,
}: ReferralCardProps) {

  const referrals =
    Number(localStorage.getItem(`referrals_${username}`)) || 0;

  const referralLink =
    `https://earncapital.com/register?ref=${username}`;

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    alert("✅ Referral link copied!");
  }

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "20px",
        marginBottom: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,.2)",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "20px",
        }}
      >
        👥 Referrals
      </h2>

      <p style={{ color: "#94a3b8" }}>
        Total Referrals
      </p>

      <h1
        style={{
          color: "white",
          marginTop: "5px",
        }}
      >
        {referrals}
      </h1>

      <input
        value={referralLink}
        readOnly
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #374151",
          background: "#1f2937",
          color: "white",
        }}
      />

      <button
        onClick={copyLink}
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        📋 Copy Link
      </button>
    </div>
  );
}