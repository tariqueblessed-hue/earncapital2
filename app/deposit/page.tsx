"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AppDepositPage() {

const [amount, setAmount] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [transactionCode, setTransactionCode] = useState("");

const [balance, setBalance] = useState(0);
const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const depositNumber = "0143390270";

  useEffect(() => {
  loadBalance();
}, []);

async function loadBalance() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("email", user.email)
    .single();

  if (data) {
    setBalance(Number(data.balance));
  }
}
async function submitDeposit() {

  if (!amount || !phoneNumber || !transactionCode) {
    alert("Please fill all deposit details.");
    return;
  }


  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user || !user.email) {
    alert("Please login first.");
    return;
  }


  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("email", user.email)
    .single();



const { data, error } = await supabase
  .from("deposits")
  .insert({
    username: profile?.username || "Unknown",
    email: user.email,
    phone: phoneNumber,
    amount: Number(amount),
    method: "M-Pesa",
    transaction_code: transactionCode,
    status: "Pending",
  })
  .select();

console.log("Inserted:", data);
console.log("Error:", error);

if (error) {
  alert(error.message);
  return;
}


 if (error) {
  console.log(error);
  alert(JSON.stringify(error));
  return;
}if (error) {
  console.log(error);
  alert(JSON.stringify(error));
  return;
}


  alert(
    "✅ Deposit submitted successfully. Waiting for approval."
  );


  setAmount("");

  setTransactionCode("");

}
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#111827,#312e81)",
        padding: "30px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >

      {/* Header */}
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          💎 Deposit Funds
        </h1>

        <p
          style={{
            color: "#cbd5e1",
          }}
        >
          Add money securely to your EarnCapital wallet.
        </p>
      </div>


      {/* Wallet Card */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          padding: "25px",
          borderRadius: "22px",
          boxShadow:
            "0 20px 40px rgba(0,0,0,.3)",
          marginBottom: "25px",
        }}
      >

        <p
          style={{
            opacity: .8,
          }}
        >
          Current Balance
        </p>

        <h1
          style={{
            fontSize:"40px",
            margin:"10px 0",
          }}
        >
    KES {balance.toLocaleString()}
        </h1>


        <span
          style={{
            background:"rgba(255,255,255,.2)",
            padding:"8px 15px",
            borderRadius:"20px",
          }}
        >
          🔒 Secure Wallet
        </span>

      </div>



      {/* M-Pesa Card */}
      <div
        style={{
          background:"#0f172a",
          border:"1px solid #334155",
          borderRadius:"22px",
          padding:"25px",
          marginBottom:"25px",
        }}
      >

        <h2>
          📱 M-Pesa Deposit
        </h2>


        <p
          style={{
            color:"#cbd5e1",
          }}
        >
          Send money to the number below:
        </p>


        <div
          style={{
            background:"#020617",
            padding:"20px",
            borderRadius:"15px",
            marginTop:"15px",
          }}
        >

          <h1
            style={{
              color:"#22c55e",
              letterSpacing:"2px",
            }}
          >
            {depositNumber}
          </h1>


          <p>
            Account Name:
            <strong> EarnCapital</strong>
          </p>

        </div>


      </div>{/* Deposit Form */}

      <div
        style={{
          background:"#0f172a",
          border:"1px solid #334155",
          borderRadius:"22px",
          padding:"25px",
          marginBottom:"25px",
        }}
      >

        <h2>
          💰 Deposit Details
        </h2>


        <label
          style={{
            display:"block",
            marginTop:"20px",
            marginBottom:"8px",
            color:"#cbd5e1",
          }}
        >
          Amount (KES)
        </label>

<label
  style={{
    display: "block",
    marginTop: "20px",
    marginBottom: "8px",
    color: "#cbd5e1",
  }}
>
  M-Pesa Phone Number
</label>

<input
  type="tel"
  placeholder="07XXXXXXXX"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  style={{
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #475569",
    background: "#020617",
    color: "white",
    fontSize: "16px",
  }}
/>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e)=>
            setAmount(e.target.value)
          }
          style={{
            width:"100%",
            padding:"15px",
            borderRadius:"12px",
            border:"1px solid #475569",
            background:"#020617",
            color:"white",
            fontSize:"16px",
            outline:"none",
          }}
        />



        <label
          style={{
            display:"block",
            marginTop:"20px",
            marginBottom:"8px",
            color:"#cbd5e1",
          }}
        >
          M-Pesa Transaction Code
        </label>


        <input
          type="text"
          placeholder="Example: QWE123XYZ"
          value={transactionCode}
          onChange={(e)=>
            setTransactionCode(e.target.value)
          }
          style={{
            width:"100%",
            padding:"15px",
            borderRadius:"12px",
            border:"1px solid #475569",
            background:"#020617",
            color:"white",
            fontSize:"16px",
            textTransform:"uppercase",
            outline:"none",
          }}
        />



        <button
          onClick={() => {
  alert("Button clicked!");
  submitDeposit();
}}
           style={{ 
            marginTop:"25px",
            padding:"16px",
            borderRadius:"14px",
            border:"none",
            cursor:"pointer",
            color:"white",
            fontSize:"17px",
            fontWeight:"bold",
            background:
              "linear-gradient(90deg,#2563eb,#7c3aed)",
            boxShadow:
              "0 10px 25px rgba(37,99,235,.35)",
          }}
        >
          🚀 Submit Deposit
        </button>


      </div>{/* Deposit History */}

      <div
        style={{
          background:"#0f172a",
          border:"1px solid #334155",
          borderRadius:"22px",
          padding:"25px",
          marginBottom:"25px",
        }}
      >

        <h2>
          📜 Deposit History
        </h2>


        <div
          style={{
            marginTop:"20px",
            background:"#020617",
            padding:"18px",
            borderRadius:"15px",
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
          }}
        >

          <div>
            <h3>
              No deposits yet
            </h3>

            <p
              style={{
                color:"#94a3b8",
                margin:0,
              }}
            >
              Your approved deposits will appear here.
            </p>
          </div>


          <span
            style={{
              background:"#ca8a04",
              padding:"8px 14px",
              borderRadius:"20px",
              fontSize:"13px",
            }}
          >
            🟡 Pending
          </span>

        </div>

      </div>



      {/* Security Card */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#064e3b,#065f46)",
          borderRadius:"22px",
          padding:"25px",
          marginBottom:"30px",
        }}
      >

        <h2>
          🔒 Secure Payments
        </h2>


        <p
          style={{
            color:"#d1fae5",
            lineHeight:"1.6",
          }}
        >
          Your deposits are manually verified by our
          finance team. Funds are added to your wallet
          only after successful payment confirmation.
        </p>


        <div
          style={{
            marginTop:"15px",
            background:"rgba(255,255,255,.12)",
            padding:"12px",
            borderRadius:"12px",
          }}
        >
          ✅ Protected Verification System
        </div>

      </div>


    </main>
  );
}