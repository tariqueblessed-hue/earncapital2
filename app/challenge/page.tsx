"use client";

import { useEffect, useState } from "react";

export default function ChallengePage() {
  const [approved, setApproved] = useState(false);
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState(0);
  const [result, setResult] = useState("");

  const questions = [
    {
      q: "What is 2 + 2?",
      answer: "4",
    },
    {
      q: "What is the capital of Kenya?",
      answer: "Nairobi",
    },
    {
      q: "How many days are in a week?",
      answer: "7",
    },
  ];

  useEffect(() => {
    const payments = JSON.parse(
      localStorage.getItem("payments") || "[]"
    );

    const isApproved = payments.some(
      (payment: any) =>
        payment.status === "Approved"
    );

    setApproved(isApproved);
  }, []);

  const saveResult = (
    finalResult: string,
    amount: number
  ) => {
    const username =
      localStorage.getItem("currentUser") ||
      "Unknown";

    const results = JSON.parse(
      localStorage.getItem(
        "challengeResults"
      ) || "[]"
    );

    results.unshift({
      username,
      result: finalResult,
      earnings: amount,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "challengeResults",
      JSON.stringify(results)
    );
  };

  const submitAnswer = (
    answer: string
  ) => {
    if (
      answer.toLowerCase() ===
      questions[
        question
      ].answer.toLowerCase()
    ) {
      if (
        question ===
        questions.length - 1
      ) {
        const user =
          localStorage.getItem(
            "currentUser"
          ) || "";

        const currentBalance =
          Number(
            localStorage.getItem(
              `balance_${user}`
            )
          ) || 0;

        localStorage.setItem(
          `balance_${user}`,
          (
            currentBalance + 700
          ).toString()
        );

        const transactions = JSON.parse(
          localStorage.getItem(
            `transactions_${user}`
          ) || "[]"
        );

        transactions.unshift({
          description:
            "🏆 Challenge Reward",
          amount: 700,
          date: new Date().toLocaleString(),
        });

        localStorage.setItem(
          `transactions_${user}`,
          JSON.stringify(transactions)
        );

        saveResult("PASS", 0);

        setResult(
          "PASS ✅ You won KES 700!"
        );
      } else {
        setQuestion(question + 1);
      }
    } else {
      const earnings =
        Number(
          localStorage.getItem(
            "adminEarnings"
          )
        ) || 0;

      localStorage.setItem(
        "adminEarnings",
        (
          earnings + 50
        ).toString()
      );

      saveResult("FAIL", 50);

      setResult(
        "FAIL ❌ Admin earned KES 50"
      );
    }
  };

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
      <h1>
        🧠 Earn Capital Challenge
      </h1>

      {!approved && (
        <>
          <h2>
            Payment not approved yet ❌
          </h2>

          <p>
            Please wait for admin
            approval.
          </p>
        </>
      )}

      {approved && !started && (
        <button
          onClick={() =>
            setStarted(true)
          }
          style={{
            padding:
              "12px 25px",
            background:
              "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Start Challenge
        </button>
      )}

      {started && !result && (
        <div>
          <h2>
            Question{" "}
            {question + 1}
          </h2>

          <p>
            {
              questions[
                question
              ].q
            }
          </p>

          {[
            "4",
            "Nairobi",
            "7",
          ].map((option) => (
            <button
              key={option}
              onClick={() =>
                submitAnswer(
                  option
                )
              }
              style={{
                display:
                  "block",
                marginTop:
                  "10px",
                padding:
                  "10px",
                width:
                  "200px",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {result && (
        <h2>
          Result: {result}
        </h2>
      )}
    </main>
  );
}