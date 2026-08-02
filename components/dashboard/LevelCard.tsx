"use client";

import { useEffect, useState } from "react";

type Props = {
  username: string;
};

export default function LevelCard({ username }: Props) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const b =
      Number(localStorage.getItem(`balance_${username}`)) || 0;
    setBalance(b);
  }, [username]);

  let level = "Bronze 🥉";
  let progress = 0;
  let next = "Silver";

  if (balance >= 50000) {
    level = "Diamond 👑";
    progress = 100;
    next = "Maximum";
  } else if (balance >= 20000) {
    level = "Platinum 💎";
    progress = Math.min(
      100,
      ((balance - 20000) / 30000) * 100
    );
    next = "Diamond";
  } else if (balance >= 5000) {
    level = "Gold 🥇";
    progress = Math.min(
      100,
      ((balance - 5000) / 15000) * 100
    );
    next = "Platinum";
  } else if (balance >= 1000) {
    level = "Silver 🥈";
    progress = Math.min(
      100,
      ((balance - 1000) / 4000) * 100
    );
    next = "Gold";
  } else {
    progress = Math.min(100, (balance / 1000) * 100);
  }

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        padding: "20px",
        color: "white",
        marginTop: "20px",
      }}
    >
      <h2>🏅 User Level</h2>

      <h1
        style={{
          marginTop: "10px",
        }}
      >
        {level}
      </h1>

      <div
        style={{
          height: "10px",
          background: "#374151",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "18px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background:
              "linear-gradient(90deg,#2563eb,#7c3aed)",
          }}
        />
      </div>

      <p
        style={{
          marginTop: "15px",
          color: "#cbd5e1",
        }}
      >
        Progress:
        {" "}
        {progress.toFixed(0)}%
      </p>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        Next Level:
        {" "}
        <b>{next}</b>
      </p>
    </div>
  );
}