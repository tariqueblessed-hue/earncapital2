"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [referralCode, setReferralCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const ref = params.get("ref");

    if (ref) {
      setReferralCode(ref);
    }
  }, []);

  const register = async () => {
    if (
      !fullName ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agree) {
      alert("Please accept Terms & Conditions.");
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } =
        await supabase.from("users").insert([
          {
            id: user.id,
            full_name: fullName,
            username,
            email,
            phone,
            balance: 0,
            referral_code: username,
            referred_by: referralCode || null,
            is_activated: false,
          },
        ]);

      if (profileError) {
        alert(profileError.message);
        setLoading(false);
        return;
      }
    }

 alert(
  "🎉 Registration successful!\n\nWe've sent a verification email to your inbox.\n\nOpen your email, click the verification link, then come back and log in."
);

router.push("/login");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#1e1b4b,#7c3aed)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.96)",
          borderRadius: "28px",
          padding: "35px",
          boxShadow:
            "0 25px 60px rgba(0,0,0,.35)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "10px",
            }}
          >
            EarnCapital
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Create your account and start your journey 🚀
          </p>
        </div><input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={input}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
        />

        <div
          style={{
            position: "relative",
            marginBottom: "16px",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              ...input,
              marginBottom: "0",
              paddingRight: "50px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "18px",
            }}
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>

        <div
          style={{
            position: "relative",
            marginBottom: "16px",
          }}
        >
          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            style={{
              ...input,
              marginBottom: "0",
              paddingRight: "50px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "18px",
            }}
          >
            {showConfirmPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>

        <input
          placeholder="Referral Code (Optional)"
          value={referralCode}
          onChange={(e) =>
            setReferralCode(e.target.value)
          }
          style={input}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#374151",
            fontSize: "14px",
            marginTop: "10px",
          }}
        >
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />

          I agree to Terms & Conditions
        </label>

        <button
          onClick={register}
          disabled={loading}
          style={button}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#6b7280",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#2563eb",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Login
          </a>
        </p>

      </div>
    </main>
  );
}const input = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  color: "#111827",
  fontSize: "15px",
  outline: "none",
  paddingRight: "50px",
  boxSizing: "border-box" as const,
};

const button = {
  width: "100%",
  padding: "17px",
  marginTop: "22px",
  border: "none",
  borderRadius: "16px",
  background:
    "linear-gradient(90deg,#2563eb,#7c3aed)",
  color: "#ffffff",
  fontSize: "17px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow:
    "0 12px 30px rgba(124,58,237,0.35)",
};