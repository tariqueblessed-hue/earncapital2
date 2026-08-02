"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [registrationFee, setRegistrationFee] = useState("300");
  const [taskReward, setTaskReward] = useState("50");
  const [dailyReward, setDailyReward] = useState("20");
  const [minimumWithdrawal, setMinimumWithdrawal] = useState("5000");
  const [requiredReferrals, setRequiredReferrals] = useState("5");

  useEffect(() => {
    setRegistrationFee(
      localStorage.getItem("registrationFee") || "300"
    );

    setTaskReward(
      localStorage.getItem("taskReward") || "50"
    );

    setDailyReward(
      localStorage.getItem("dailyReward") || "20"
    );

    setMinimumWithdrawal(
      localStorage.getItem("minimumWithdrawal") || "5000"
    );

    setRequiredReferrals(
      localStorage.getItem("requiredReferrals") || "5"
    );
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      "registrationFee",
      registrationFee
    );

    localStorage.setItem(
      "taskReward",
      taskReward
    );

    localStorage.setItem(
      "dailyReward",
      dailyReward
    );

    localStorage.setItem(
      "minimumWithdrawal",
      minimumWithdrawal
    );

    localStorage.setItem(
      "requiredReferrals",
      requiredReferrals
    );

    alert("✅ Settings saved successfully.");
  };

  return (
    <main>
      <h1
        style={{
          marginBottom: "25px",
        }}
      >
        ⚙ Platform Settings
      </h1>

      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "15px",
          maxWidth: "650px",
        }}
      >
        <Input
          label="Registration Fee (KES)"
          value={registrationFee}
          setValue={setRegistrationFee}
        />

        <Input
          label="Task Reward (KES)"
          value={taskReward}
          setValue={setTaskReward}
        />

        <Input
          label="Daily Reward (KES)"
          value={dailyReward}
          setValue={setDailyReward}
        />

        <Input
          label="Minimum Withdrawal (KES)"
          value={minimumWithdrawal}
          setValue={setMinimumWithdrawal}
        />

        <Input
          label="Required Referrals"
          value={requiredReferrals}
          setValue={setRequiredReferrals}
        />

        <button
          onClick={saveSettings}
          style={{
            marginTop: "25px",
            padding: "15px",
            width: "100%",
            border: "none",
            borderRadius: "12px",
            background:
              "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          💾 Save Settings
        </button>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div
      style={{
        marginBottom: "18px",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "bold",
        }}
      >
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
      />
    </div>
  );
}