"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: number;
  title: string;
  description: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  reward: number;
  active: boolean;
};

export default function TasksPage() {
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("");

  const [balance, setBalance] = useState(0);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});

  const [totalRewards, setTotalRewards] = useState(0);

  const [xp, setXp] = useState(0);

  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email);

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username,balance")
      .eq("email", user.email)
      .single();

    if (profileError || !profile) {
      setLoading(false);
      alert("Unable to load account.");
      return;
    }

    setUsername(profile.username);

    setBalance(Number(profile.balance || 0));

    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("active", true)
      .order("id");

    if (taskData) {
      setTasks(taskData as Task[]);
    }

    const { data: answers } = await supabase
      .from("task_answers")
      .select("task_id,reward_paid")
      .eq("username", profile.username);

    if (answers) {
      setCompletedTasks(answers.map((a) => a.task_id));

      const rewards = answers.reduce(
        (sum, a) => sum + Number(a.reward_paid || 0),
        0
      );

      setTotalRewards(rewards);

      setXp(answers.length * 10);

      if (taskData) {
        setCompletion(
          Math.round((answers.length / taskData.length) * 100)
        );
      }
    }

    setLoading(false);
  }

  async function submitAnswer(task: Task) {
    const answer = selectedAnswers[task.id];

    if (!answer) {
      alert("Please select an answer first.");
      return;
    }

  const { data: existing } = await supabase
  .from("task_answers")
  .select("id")
  .eq("email", email)
  .eq("task_id", task.id)
  .maybeSingle();

    if (existing) {
      alert("✅ You already completed this task.");
      return;
    }

    const isCorrect = answer === task.correct_answer;

    let reward = 0;

    if (isCorrect) {
      reward = Number(task.reward);

      const newBalance = balance + reward;

      const { data: updatedUser, error: walletError } = await supabase
  .from("users")
  .update({
    balance: newBalance,
  })
  .eq("email", email)
  .select();

console.log("Updated user:", updatedUser);

if (walletError) {
  console.log(walletError);
  alert(walletError.message);
  return;
}
  if (walletError) {
  alert("Failed to update wallet.");
  console.error(walletError);
  return;
}

      setBalance(newBalance);
    }

   const { error: answerError } = await supabase
  .from("task_answers")
  .upsert(
    {
      username,
      email,
      task_id: task.id,
      selected_answer: answer,
      correct: isCorrect,
      reward_paid: reward,
    },
    {
      onConflict: "email,task_id",
    }
  );

    if (answerError) {
      alert(answerError.message);
      return;
    }

   

    if (isCorrect) {
      alert(`🎉 Correct! KES ${reward} added to your wallet.`);
    } else {
      alert("❌ Wrong answer.");
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        Loading Tasks...
      </main>
    );
  }return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
        color: "white",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          🧠 AI Tasks Marketplace
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "17px",
          }}
        >
          Complete AI tasks and earn instant rewards.
        </p>
      </div>

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          borderRadius: "24px",
          padding: "28px",
          marginBottom: "30px",
        }}
      >
        <p>Wallet Balance</p>

        <h1
          style={{
            fontSize: "42px",
            marginTop: "10px",
          }}
        >
          KES {balance.toLocaleString()}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "20px",
            }}
          >
            ⭐ {xp} XP
          </span>

          <span
            style={{
              background: "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "20px",
            }}
          >
            🎁 KES {totalRewards}
          </span>

          <span
            style={{
              background: "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "20px",
            }}
          >
            📊 {completion}% Complete
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <SummaryCard
          title="Wallet"
          value={`KES ${balance}`}
          color="#22c55e"
        />

        <SummaryCard
          title="Completed"
          value={completedTasks.length}
          color="#38bdf8"
        />

        <SummaryCard
          title="Rewards"
          value={`KES ${totalRewards}`}
          color="#facc15"
        />

        <SummaryCard
          title="XP"
          value={`${xp} XP`}
          color="#a855f7"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
          gap: "25px",
        }}
      >
        {tasks.map((task) => {
          const completed =
            completedTasks.includes(task.id);

          return (
            <div
              key={task.id}
              style={{
                background: "#0f172a",
                border: completed
                  ? "2px solid #22c55e"
                  : "1px solid #334155",
                borderRadius: "20px",
                padding: "25px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h2>{task.title}</h2>

                <span
                  style={{
                    background: completed
                      ? "#16a34a"
                      : "#2563eb",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    fontSize: "13px",
                  }}
                >
                  {completed
                    ? "Completed"
                    : "Active"}
                </span>
              </div>

              <p
                style={{
                  color: "#cbd5e1",
                  marginTop: "15px",
                  marginBottom: "20px",
                }}
              >
                {task.description}
              </p>

              {[
                ["A", task.option_a],
                ["B", task.option_b],
                ["C", task.option_c],
                ["D", task.option_d],
              ].map(([letter, text]) => (
                <label
                  key={letter}
                  style={{
                    display: "block",
                    padding: "14px",
                    marginBottom: "12px",
                    background: "#020617",
                    borderRadius: "12px",
                    cursor: completed
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  <input
                    disabled={completed}
                    type="radio"
                    name={`task-${task.id}`}
                    checked={
                      selectedAnswers[task.id] ===
                      letter
                    }
                    onChange={() =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [task.id]:
                          letter as string,
                      }))
                    }
                  />

                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    {text}
                  </span>
                </label>
              ))}

              <p
                style={{
                  marginTop: "20px",
                  color: "#22c55e",
                  fontWeight: "bold",
                }}
              >
                Reward: KES {task.reward}
              </p>

              <button
                disabled={completed}
                onClick={() =>
                  submitAnswer(task)
                }
                style={{
                  width: "100%",
                  marginTop: "18px",
                  padding: "15px",
                  border: "none",
                  borderRadius: "14px",
                  cursor: completed
                    ? "not-allowed"
                    : "pointer",
                  background: completed
                    ? "#16a34a"
                    : "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {completed
                  ? "✅ Completed"
                  : "🚀 Submit Answer"}
              </button>
            </div>
          );
        })}
      </div></main>
  );
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "18px",
        padding: "22px",
        boxShadow: "0 10px 25px rgba(0,0,0,.25)",
      }}
    >
      <h3
        style={{
          color: "#94a3b8",
          margin: 0,
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color,
          marginTop: "12px",
          marginBottom: 0,
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        {value}
      </h1>
    </div>
  );
}