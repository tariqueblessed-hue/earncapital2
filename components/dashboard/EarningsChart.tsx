"use client";

export default function EarningsChart() {
  const data = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 65 },
    { day: "Wed", value: 55 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 95 },
    { day: "Sat", value: 70 },
    { day: "Sun", value: 100 },
  ];

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "20px",
        marginTop: "25px",
        boxShadow: "0 8px 20px rgba(0,0,0,.2)",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        📈 Weekly Earnings
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: "180px",
          gap: "10px",
        }}
      >
        {data.map((item) => (
          <div
            key={item.day}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "28px",
                height: `${item.value}%`,
                background:
                  "linear-gradient(180deg,#3b82f6,#7c3aed)",
                borderRadius: "8px 8px 0 0",
                transition: ".3s",
              }}
            />

            <small
              style={{
                color: "#94a3b8",
                marginTop: "8px",
              }}
            >
              {item.day}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}