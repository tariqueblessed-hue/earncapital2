"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEarnCapitalPopup } from "@/components/notifications/EarnCapitalPopup";

export default function LoginPage() {
  const router = useRouter();
  const { showPopup } = useEarnCapitalPopup();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email.trim() || !password) {
      showPopup(
        "warning",
        "Almost there 👀",
        "Please enter your email address and password."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        showPopup(
          "error",
          "Login unsuccessful",
          error.message
        );

        setLoading(false);
        return;
      }

      if (!data.user) {
        showPopup(
          "error",
          "Login unsuccessful",
          "We couldn't find your account. Please try again."
        );

        setLoading(false);
        return;
      }

      /*
       * Email verification check
       */
      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut();

        showPopup(
          "warning",
          "Verify your email first 📩",
          "Your account exists, but your email hasn't been verified yet. Please check your inbox and click the verification link."
        );

        setLoading(false);
        return;
      }

      /*
       * Load user profile
       */
      const { data: profile, error: profileError } =
        await supabase
          .from("users")
          .select("username")
          .eq("id", data.user.id)
          .single();

      if (profileError) {
        console.error(
          "Profile loading error:",
          profileError
        );
      }

      /*
       * Save current user information
       */
      localStorage.setItem(
        "currentUserId",
        data.user.id
      );

      localStorage.setItem(
        "currentUser",
        profile?.username || ""
      );

      /*
       * Beautiful login message
       */
      showPopup(
        "success",
        "Welcome back! 👋",
        `Great to see you again${
          profile?.username
            ? `, ${profile.username}`
            : ""
        }! Your EarnCapital account is ready.`,
        "Continue"
      );

      /*
       * Give the popup time to appear
       * before moving to dashboard.
       */
      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);
    } catch (error) {
      console.error("Login error:", error);

      showPopup(
        "error",
        "Something went wrong",
        "We couldn't complete your login. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background:
          "linear-gradient(135deg,#020617,#1e1b4b,#7c3aed)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "35px",
          boxShadow:
            "0 25px 60px rgba(0,0,0,.25)",
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
              fontSize: "34px",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "10px",
            }}
          >
            Welcome Back 👋
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Login to your EarnCapital account
          </p>
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={input}
        />

        <div
          style={{
            position: "relative",
            marginBottom: "10px",
          }}
        >
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
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
              setShowPassword(!showPassword)
            }
            style={eyeButton}
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>

        <p
          style={{
            textAlign: "right",
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          <a
            href="/forgot-password"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Forgot Password?
          </a>
        </p>

        <button
          onClick={login}
          disabled={loading}
          style={{
            ...button,
            opacity: loading ? 0.7 : 1,
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#6b7280",
          }}
        >
          Don't have an account?{" "}
          <a
            href="/register"
            style={{
              color: "#2563eb",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Create Account
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
  padding: "16px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(90deg,#2563eb,#7c3aed)",
  color: "#ffffff",
  fontSize: "17px",
  fontWeight: "700",
  boxShadow:
    "0 10px 25px rgba(124,58,237,.35)",
};