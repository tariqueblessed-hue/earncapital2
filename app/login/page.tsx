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
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      showPopup(
        "warning",
        "Almost there 👀",
        "Please enter your email address and password."
      );
      return;
    }

    setLoading(true);

    try {
      console.log("Starting login...");

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

      /* =========================
         LOGIN ERROR
      ========================= */

      if (error) {
        console.error(
          "SUPABASE LOGIN ERROR:",
          error
        );

        showPopup(
          "error",
          "Login unsuccessful ❌",
          error.message ||
            "Invalid email or password. Please check your details and try again."
        );

        setLoading(false);
        return;
      }

      /* =========================
         NO USER
      ========================= */

      if (!data || !data.user) {
        showPopup(
          "error",
          "Login unsuccessful ❌",
          "We couldn't find your account. Please check your email and password."
        );

        setLoading(false);
        return;
      }

      console.log(
        "Login successful:",
        data.user.id
      );

      /* =========================
         LOAD USER PROFILE
      ========================= */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("users")
        .select("username, full_name, email, phone")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Profile loading error:",
          profileError
        );
      }

      /* =========================
         SAVE CURRENT USER
      ========================= */

      localStorage.setItem(
        "currentUserId",
        data.user.id
      );

      localStorage.setItem(
        "currentUser",
        profile?.username ||
          data.user.user_metadata?.username ||
          ""
      );

      localStorage.setItem(
        "currentUserEmail",
        data.user.email || cleanEmail
      );

      /* =========================
         SUCCESS
      ========================= */

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

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(
        "LOGIN CATCH ERROR:",
        error
      );

      let message =
        "We couldn't complete your login. Please try again.";

      if (
        error instanceof Error &&
        error.message
      ) {
        message = error.message;
      }

      showPopup(
        "error",
        "Something went wrong ❌",
        message
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
        {/* HEADER */}

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

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={input}
        />

        {/* PASSWORD */}

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

        {/* FORGOT PASSWORD */}

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

        {/* LOGIN BUTTON */}

        <button
          type="button"
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

        {/* REGISTER */}

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

/* =========================
   INPUT
========================= */

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

/* =========================
   EYE BUTTON
========================= */

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

/* =========================
   LOGIN BUTTON
========================= */

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