"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useEarnCapitalPopup } from "@/components/notifications/EarnCapitalPopup";

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
  const { showPopup } = useEarnCapitalPopup();

  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [balance, setBalance] = useState(0);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [completedTasks, setCompletedTasks] = useState<number[]>(
    []
  );

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});

  const [totalRewards, setTotalRewards] = useState(0);
  const [xp, setXp] = useState(0);
  const [completion, setCompletion] = useState(0);

  const [submittingTask, setSubmittingTask] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email);

    const { data: profile, error: profileError } =
      await supabase
        .from("users")
        .select("username,balance")
        .eq("email", user.email)
        .single();

    if (profileError || !profile) {
      showPopup(
        "error",
        "Account unavailable",
        "We were unable to load your EarnCapital account."
      );

      setLoading(false);
      return;
    }

    setUsername(profile.username);
    setBalance(Number(profile.balance || 0));

    const { data: taskData, error: taskError } =
      await supabase
        .from("tasks")
        .select("*")
        .eq("active", true)
        .order("id");

    if (taskError) {
      showPopup(
        "error",
        "Tasks unavailable",
        "We couldn't load today's tasks. Please try again."
      );

      setLoading(false);
      return;
    }

    const loadedTasks = (taskData || []) as Task[];

    setTasks(loadedTasks);

    const { data: answers, error: answersError } =
      await supabase
        .from("task_answers")
        .select("task_id,reward_paid")
        .eq("username", profile.username);

    if (answersError) {
      console.error("Task answers error:", answersError);
    }

    if (answers) {
      const completedIds = answers.map(
        (answer) => Number(answer.task_id)
      );

      setCompletedTasks(completedIds);

      const rewards = answers.reduce(
        (sum, answer) =>
          sum + Number(answer.reward_paid || 0),
        0
      );

      setTotalRewards(rewards);

      setXp(answers.length * 10);

      if (loadedTasks.length > 0) {
        setCompletion(
          Math.min(
            100,
            Math.round(
              (answers.length / loadedTasks.length) * 100
            )
          )
        );
      } else {
        setCompletion(0);
      }
    } else {
      setCompletedTasks([]);
      setTotalRewards(0);
      setXp(0);
      setCompletion(0);
    }

    setLoading(false);
  }

  async function submitAnswer(task: Task) {
    if (submittingTask !== null) {
      return;
    }

    const answer = selectedAnswers[task.id];

    if (!answer) {
      showPopup(
        "warning",
        "Choose an answer 👀",
        "Please select one of the four answers before submitting."
      );
      return;
    }

    setSubmittingTask(task.id);

    try {
      /*
       * Check whether this task has already been completed.
       */
      const { data: existing, error: existingError } =
        await supabase
          .from("task_answers")
          .select("id")
          .eq("email", email)
          .eq("task_id", task.id)
          .maybeSingle();

      if (existingError) {
        console.error(existingError);

        showPopup(
          "error",
          "Something went wrong",
          "We couldn't check your task status."
        );

        return;
      }

      if (existing) {
        showPopup(
          "info",
          "Already completed ✅",
          "You've already completed this task."
        );

        return;
      }

      const isCorrect =
        answer === task.correct_answer;

      let reward = 0;

      /*
       * Correct answer
       */
      if (isCorrect) {
        reward = Number(task.reward || 0);

        const newBalance = balance + reward;

        const {
          data: updatedUser,
          error: walletError,
        } = await supabase
          .from("users")
          .update({
            balance: newBalance,
          })
          .eq("email", email)
          .select("balance")
          .single();

        if (walletError || !updatedUser) {
          console.error(walletError);

          showPopup(
            "error",
            "Wallet update failed",
            "Your answer was correct, but we couldn't update your wallet. Please try again."
          );

          return;
        }

        setBalance(Number(updatedUser.balance));
      }

      /*
       * Save answer
       */
      const { error: answerError } =
        await supabase
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
        console.error(answerError);

        /*
         * If wallet was already updated but answer
         * couldn't be saved, don't silently continue.
         */
        showPopup(
          "error",
          "Task could not be saved",
          answerError.message
        );

        return;
      }

      /*
       * Update local task state
       */
      const newCompletedTasks = [
        ...completedTasks,
        task.id,
      ];

      setCompletedTasks(newCompletedTasks);

      setTotalRewards(
        (previous) => previous + reward
      );

      setXp(
        (previous) => previous + 10
      );

      const newCompletion =
        tasks.length > 0
          ? Math.min(
              100,
              Math.round(
                (newCompletedTasks.length /
                  tasks.length) *
                  100
              )
            )
          : 0;

      setCompletion(newCompletion);

      /*
       * Correct answer popup
       */
      if (isCorrect) {
        if (
          tasks.length > 0 &&
          newCompletedTasks.length >= tasks.length
        ) {
          showPopup(
            "celebration",
            "Today's Tasks Completed! 🎉",
            `Amazing work! You've completed all ${tasks.length} tasks for today and earned KES ${reward.toLocaleString()} from this task.`,
            "Awesome! 🏆"
          );
        } else {
          showPopup(
            "celebration",
            "Correct Answer! 🎉",
            `Excellent work! KES ${reward.toLocaleString()} has been added to your wallet.`,
            "Continue"
          );
        }
      } else {
        /*
         * Incorrect answer
         *
         * The task is still recorded as completed,
         * but no reward is added.
         */
        if (
          tasks.length > 0 &&
          newCompletedTasks.length >= tasks.length
        ) {
          showPopup(
            "info",
            "Tasks Completed 🎯",
            "You've finished all of today's tasks. Keep coming back tomorrow for more!",
            "Continue"
          );
        } else {
          showPopup(
            "info",
            "Task Completed",
            "Your answer has been recorded. No reward was added for this answer.",
            "Continue"
          );
        }
      }

      /*
       * Remove selected answer after submission.
       */
      setSelectedAnswers((previous) => {
        const updated = { ...previous };
        delete updated[task.id];
        return updated;
      });
    } catch (error) {
      console.error("Submit task error:", error);

      showPopup(
        "error",
        "Something went wrong",
        "We couldn't submit your answer. Please try again."
      );
    } finally {
      setSubmittingTask(null);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#020617",
          color: "white",
          fontSize: "24px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Loading Today's Tasks... 🚀
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
        padding: "30px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 30px",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#4f46e5,#7c3aed)",
            borderRadius: "24px",
            padding: "30px",
            boxShadow:
              "0 20px 45px rgba(37,99,235,.35)",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "800",
              margin: 0,
            }}
          >
            🎯 Today's Tasks
          </h1>

          <p
            style={{
              color: "#dbeafe",
              marginTop: "10px",
              fontSize: "16px",
            }}
          >
            Complete your tasks and grow your EarnCapital
            wallet 🚀
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <span style={badge}>
              👤 {username}
            </span>

            <span style={badge}>
              💰 KES{" "}
              {balance.toLocaleString()}
            </span>

            <span style={badge}>
              🏆 {xp} XP
            </span>

            <span style={badge}>
              📊 {completion}% Complete
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 30px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <SummaryCard
          title="Wallet"
          value={`KES ${balance.toLocaleString()}`}
          color="#22c55e"
        />

        <SummaryCard
          title="Completed"
          value={`${completedTasks.length}/${tasks.length}`}
          color="#38bdf8"
        />

        <SummaryCard
          title="Rewards"
          value={`KES ${totalRewards.toLocaleString()}`}
          color="#facc15"
        />

        <SummaryCard
          title="XP"
          value={`${xp} XP`}
          color="#a855f7"
        />
      </div>

      {/* Tasks */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
          gap: "25px",
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                marginBottom: "15px",
              }}
            >
              🎉
            </div>

            <h2>No tasks available</h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Check back later for new tasks.
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const completed =
              completedTasks.includes(task.id);

            const submitting =
              submittingTask === task.id;

            const options = [
              ["A", task.option_a],
              ["B", task.option_b],
              ["C", task.option_c],
              ["D", task.option_d],
            ];

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
                  boxShadow:
                    "0 12px 30px rgba(0,0,0,.2)",
                }}
              >
                {/* Task header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "21px",
                    }}
                  >
                    {task.title}
                  </h2>

                  <span
                    style={{
                      flexShrink: 0,
                      background: completed
                        ? "#16a34a"
                        : "#2563eb",
                      padding: "8px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {completed
                      ? "Completed"
                      : "Active"}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    color: "#cbd5e1",
                    marginTop: "15px",
                    marginBottom: "20px",
                    lineHeight: "1.6",
                  }}
                >
                  {task.description}
                </p>

                {/* Options */}
                {options.map(([letter, text]) => (
                  <label
                    key={letter}
                    style={{
                      display: "block",
                      padding: "14px",
                      marginBottom: "12px",
                      background:
                        selectedAnswers[
                          task.id
                        ] === letter
                          ? "#1e3a8a"
                          : "#020617",
                      border:
                        selectedAnswers[
                          task.id
                        ] === letter
                          ? "1px solid #3b82f6"
                          : "1px solid #1e293b",
                      borderRadius: "12px",
                      cursor:
                        completed || submitting
                          ? "not-allowed"
                          : "pointer",
                      transition:
                        "0.2s ease",
                    }}
                  >
                    <input
                      disabled={
                        completed ||
                        submitting
                      }
                      type="radio"
                      name={`task-${task.id}`}
                      checked={
                        selectedAnswers[
                          task.id
                        ] === letter
                      }
                      onChange={() =>
                        setSelectedAnswers(
                          (previous) => ({
                            ...previous,
                            [task.id]:
                              letter,
                          })
                        )
                      }
                    />

                    <span
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      <strong>
                        {letter}.
                      </strong>{" "}
                      {text}
                    </span>
                  </label>
                ))}

                {/* Reward */}
                <p
                  style={{
                    marginTop: "20px",
                    color: "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  💰 Reward: KES{" "}
                  {Number(
                    task.reward
                  ).toLocaleString()}
                </p>

                {/* Submit */}
                <button
                  disabled={
                    completed ||
                    submitting
                  }
                  onClick={() =>
                    submitAnswer(task)
                  }
                  style={{
                    width: "100%",
                    marginTop: "18px",
                    padding: "15px",
                    border: "none",
                    borderRadius: "14px",
                    cursor:
                      completed ||
                      submitting
                        ? "not-allowed"
                        : "pointer",
                    background:
                      completed
                        ? "#16a34a"
                        : submitting
                        ? "#475569"
                        : "linear-gradient(90deg,#2563eb,#7c3aed)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {completed
                    ? "✅ Completed"
                    : submitting
                    ? "Submitting..."
                    : "🚀 Submit Answer"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </main>
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
        boxShadow:
          "0 10px 25px rgba(0,0,0,.25)",
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

const badge = {
  background: "rgba(255,255,255,.15)",
  padding: "8px 14px",
  borderRadius: "20px",
  fontSize: "13px",
};