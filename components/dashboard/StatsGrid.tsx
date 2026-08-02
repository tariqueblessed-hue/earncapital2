"use client";

type StatsGridProps = {
  username: string;
};

export default function StatsGrid({
  username,
}: StatsGridProps) {
  const balance =
    Number(localStorage.getItem(`balance_${username}`)) || 0;

  const referrals =
    Number(localStorage.getItem(`referrals_${username}`)) || 0;

  const cards = [
    {
      title: "Referrals",
      value: referrals,
      icon: "👥",
      color: "#2563eb",
    },
    {
      title: "Earnings",
      value: `KES ${balance.toLocaleString()}`,
      icon: "💰",
      color: "#16a34a",
    },
    {
      title: "Goal",
      value: `${Math.min(Math.floor((balance / 5000) * 100), 100)}%`,
      icon: "🎯",
      color: "#f59e0b",
    },
    {
      title: "Rank",
      value: "Premium",
      icon: "🏆",
      color: "#7c3aed",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: "16px",
        marginTop: "22px",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: "#111827",
            borderRadius: "16px",
            padding: "18px",
            borderLeft: `4px solid ${card.color}`,
            boxShadow: "0 8px 18px rgba(0,0,0,.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                {card.title}
              </p>

              <h3
                style={{
                  color: "white",
                  marginTop: "8px",
                  marginBottom: 0,
                  fontSize: "22px",
                }}
              >
                {card.value}
              </h3>
            </div>

            <span
              style={{
                fontSize: "34px",
              }}
            >
              {card.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}