"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEarnCapitalPopup } from "@/components/notifications/EarnCapitalPopup";

export default function RegisterPage() {
  const router = useRouter();
  const { showPopup } = useEarnCapitalPopup();

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
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      setReferralCode(ref);
    }
  }, []);

  const register = async () => {
    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      showPopup(
        "warning",
        "Almost there 👀",
        "Please fill in all the required fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      showPopup(
        "error",
        "Passwords don't match",
        "Please make sure both password fields contain the same password."
      );
      return;
    }

    if (password.length < 6) {
      showPopup(
        "warning",
        "Password too short",
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (!agree) {
      showPopup(
        "warning",
        "Terms & Conditions",
        "Please accept the Terms & Conditions before creating your account."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: username.trim(),
            phone: phone.trim(),
            referral_code: username.trim(),
            referred_by: referralCode.trim() || null,
          },
        },
      });

      if (error) {
        showPopup(
          "error",
          "Registration failed",
          error.message
        );
        setLoading(false);
        return;
      }

      if (!data.user) {
        showPopup(
          "error",
          "Registration failed",
          "We couldn't create your account. Please try again."
        );
        setLoading(false);
        return;
      }

      await supabase.auth.signOut();

      showPopup(
        "celebration",
        "Congratulations! 🎉",
        "Your EarnCapital account has been created successfully! We've sent a verification email to your inbox. Verify your email before logging in.",
        "Go to Login"
      );

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (error) {
      console.error("Registration error:", error);

      showPopup(
        "error",
        "Something went wrong",
        "We couldn't complete your registration. Please try again."
      );

      setLoading(false);
    }
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
          boxShadow: "0 25px 60px rgba(0,0,0,.35)",
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
        </div>

        <input
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

        {/* Password */}
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
            onClick={() => setShowPassword(!showPassword)}
            style={eyeButton}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div
          style={{
            position: "relative",
            marginBottom: "16px",
          }}
        >
          <input
            type={showConfirmPassword ? "text" : "password"}
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
              setShowConfirmPassword(!showConfirmPassword)
            }
            style={eyeButton}
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
          onChange={(e) => setReferralCode(e.target.value)}
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
          style={{
            ...button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
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
}

const input = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  color: "#111827",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const eyeButton = {
  position: "absolute" as const,
  right: "15px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "#6b7280",
  fontSize: "18px",
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
  boxShadow:
    "0 12px 30px rgba(124,58,237,0.35)",
};