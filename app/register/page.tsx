"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      setReferralCode(ref);
    }
  }, []);const register = async () => {
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
      alert("Please accept the Terms & Conditions.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
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
      const { error: insertError } = await supabase
        .from("users")
        .insert([
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

      if (insertError) {
        alert(insertError.message);
        setLoading(false);
        return;
      }
    }

    alert(
      "Account created successfully! Please check your email to verify your account."
    );

    router.push("/login");
  };return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020617,#312e81,#7c3aed)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "25px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h1>Create Account</h1>

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
          placeholder="Email"
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={input}
        />

        <input
          placeholder="Referral Code (Optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          style={input}
        />

        <label style={{ color: "#111827" }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />{" "}
          I agree to the Terms & Conditions
        </label>

        <button
          onClick={register}
          disabled={loading}
          style={button}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </div>
    </main>
  );
}

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const button = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};