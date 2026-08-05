"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function PaymentMethodsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [mpesaNumber, setMpesaNumber] = useState("");
  const [mpesaName, setMpesaName] = useState("");

  const [paypalEmail, setPaypalEmail] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  async function loadPaymentMethods() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      setMpesaNumber(data.mpesa_number || "");
      setMpesaName(data.mpesa_name || "");

      setPaypalEmail(data.paypal_email || "");

      setBankName(data.bank_name || "");
      setBankAccount(data.bank_account || "");
      setBankAccountName(data.bank_account_name || "");
    }

    setLoading(false);
  }

  async function savePaymentMethods() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return;

    const { error } = await supabase
      .from("users")
      .update({
        mpesa_number: mpesaNumber,
        mpesa_name: mpesaName,
        paypal_email: paypalEmail,
        bank_name: bankName,
        bank_account: bankAccount,
        bank_account_name: bankAccountName,
      })
      .eq("email", user.email);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Payment methods updated successfully.");
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            color: "white",
            padding: "40px",
            fontSize: "22px",
          }}
        >
          Loading Payment Methods...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "750px",
          margin: "30px auto",
          background: "#111827",
          borderRadius: "20px",
          padding: "30px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          💳 Payment Methods
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Save your preferred withdrawal accounts.
        </p>

        <h2 style={{ marginBottom: "15px" }}>📱 M-Pesa</h2>

        <label style={label}>M-Pesa Number</label>
        <input
          value={mpesaNumber}
          onChange={(e) => setMpesaNumber(e.target.value)}
          style={input}
        />

        <label style={label}>Account Name</label>
        <input
          value={mpesaName}
          onChange={(e) => setMpesaName(e.target.value)}
          style={input}
        />

        <h2 style={{ marginTop: "30px", marginBottom: "15px" }}>💵 PayPal</h2>

        <label style={label}>PayPal Email</label>
        <input
          value={paypalEmail}
          onChange={(e) => setPaypalEmail(e.target.value)}
          style={input}
        />

        <h2 style={{ marginTop: "30px", marginBottom: "15px" }}>🏦 Bank Account</h2>

        <label style={label}>Bank Name</label>
        <input
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          style={input}
        />

        <label style={label}>Account Number</label>
        <input
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          style={input}
        />

        <label style={label}>Account Name</label>
        <input
          value={bankAccountName}
          onChange={(e) => setBankAccountName(e.target.value)}
          style={input}
        /><button
          onClick={savePaymentMethods}
          style={{
            width: "100%",
            marginTop: "30px",
            padding: "16px",
            border: "none",
            borderRadius: "14px",
            background: "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white",
            fontSize: "17px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(124,58,237,.35)",
          }}
        >
          💾 Save Payment Methods
        </button>

      </div>

    </DashboardLayout>
  );
}

const label = {
  display: "block" as const,
  marginTop: "18px",
  marginBottom: "8px",
  color: "#cbd5e1",
  fontWeight: "600",
};

const input = {
  width: "100%",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #374151",
  background: "#1f2937",
  color: "#ffffff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box" as const,
};