"use client";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>💜 EarnCapital Pro</h1>

          <div>
            <button
              onClick={() =>
                (window.location.href =
                  "/login")
              }
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
              }}
            >
              Login
            </button>

            <button
              onClick={() =>
                (window.location.href =
                  "/register")
              }
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#7c3aed",
                color: "white",
              }}
            >
              Register
            </button>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          <h1
            style={{
              fontSize: "55px",
            }}
          >
            Earn Daily Through
            AI Tasks
          </h1>

          <p
            style={{
              marginTop: "20px",
              fontSize: "20px",
              color: "#cbd5e1",
            }}
          >
            Complete tasks, earn rewards,
            refer friends and grow your
            income.
          </p>

          <button
            onClick={() =>
              (window.location.href =
                "/register")
            }
            style={{
              marginTop: "30px",
              padding: "15px 35px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
            }}
          >
            🚀 Get Started
          </button>
        </div>

        {/* Features */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "100px",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "15px",
            }}
          >
            <h3>🧠 AI Tasks</h3>
            <p>
              Complete simple AI-powered
              tasks and earn money.
            </p>
          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "15px",
            }}
          >
            <h3>🔗 Referrals</h3>
            <p>
              Invite friends and earn
              referral commissions.
            </p>
          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "15px",
            }}
          >
            <h3>💸 Withdrawals</h3>
            <p>
              Withdraw through M-Pesa,
              PayPal and Bank.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}