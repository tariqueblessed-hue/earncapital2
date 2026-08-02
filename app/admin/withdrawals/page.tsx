"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Withdrawal = {
  id: number;
  username: string;
  amount: number;
  method: string;
  account: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
};

export default function AdminWithdrawalsPage() {

  const [loading, setLoading] = useState(true);

  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState("All");

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function loadWithdrawals() {

    setLoading(true);

    const { data, error } =
      await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error && data) {
      setWithdrawals(data as Withdrawal[]);
    }

    setLoading(false);

  }

  const filtered = useMemo(() => {

    return withdrawals.filter((item) => {

      const searchMatch =
        item.username
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const filterMatch =
        filter === "All"
          ? true
          : item.status === filter;

      return searchMatch && filterMatch;

    });

  }, [withdrawals, search, filter]);

  const pending =
    withdrawals.filter(
      w => w.status === "Pending"
    ).length;

  const approved =
    withdrawals.filter(
      w => w.status === "Approved"
    ).length;

  const rejected =
    withdrawals.filter(
      w => w.status === "Rejected"
    ).length;

  const totalAmount =
    withdrawals.reduce(
      (sum, w) =>
        sum + Number(w.amount),
      0
    );async function updateWithdrawal(
  item: Withdrawal,
  action: "Approved" | "Rejected"
) {

  if (item.status !== "Pending") {
    alert("This withdrawal has already been processed.");
    return;
  }

  const { error } = await supabase
    .from("withdrawals")
    .update({
      status: action,
    })
    .eq("id", item.id);

  if (error) {
    alert(error.message);
    return;
  }

  if (action === "Approved") {

    const { data: userData } = await supabase
      .from("users")
      .select("balance")
      .eq("username", item.username)
      .single();

    if (userData) {

      const newBalance =
        Number(userData.balance) -
        Number(item.amount);

      await supabase
        .from("users")
        .update({
          balance: newBalance,
        })
        .eq("username", item.username);

    }

  }

  alert(`Withdrawal ${action}`);

  loadWithdrawals();

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
        fontWeight: "bold",
      }}
    >
      Loading Withdrawal Dashboard...
    </main>
  );
}

return (
  <main
    style={{
      minHeight: "100vh",
      padding: "30px",
      background:
        "linear-gradient(135deg,#020617,#111827,#312e81)",
      color: "white",
      fontFamily: "Arial",
    }}
  >

    <h1 style={{ fontSize: "36px" }}>
      💸 Withdrawal Management
    </h1>

    <p style={{ color: "#94a3b8" }}>
      Premium Admin Dashboard
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        marginTop: "25px",
        marginBottom: "30px",
      }}
    >
      <Card title="Pending" value={pending} color="#facc15" />
      <Card title="Approved" value={approved} color="#22c55e" />
      <Card title="Rejected" value={rejected} color="#ef4444" />
      <Card
        title="Total Amount"
        value={`KES ${totalAmount.toLocaleString()}`}
        color="#38bdf8"
      />
    </div>

    <input
      placeholder="Search username..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        marginBottom: "15px",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "25px",
      }}
    >
      {["All","Pending","Approved","Rejected"].map((status)=>(
        <button
          key={status}
          onClick={()=>setFilter(status)}
          style={{
            padding:"10px 18px",
            border:"none",
            borderRadius:"10px",
            cursor:"pointer",
            background:
              filter===status
                ? "#2563eb"
                : "#334155",
            color:"white",
            fontWeight:"bold",
          }}
        >
          {status}
        </button>
      ))}
    </div>

    {filtered.map((item)=>(

      <div
        key={item.id}
        style={{
          background:"#0f172a",
          border:"1px solid #334155",
          borderRadius:"16px",
          padding:"20px",
          marginBottom:"18px",
        }}
      >

        <h2>{item.username}</h2>

        <p><b>Amount:</b> KES {Number(item.amount).toLocaleString()}</p>

        <p><b>Method:</b> {item.method}</p>

        <p><b>Account:</b> {item.account}</p>

        <p>
          <b>Status:</b>{" "}
          <span
            style={{
              color:
                item.status==="Approved"
                  ? "#22c55e"
                  : item.status==="Rejected"
                  ? "#ef4444"
                  : "#facc15",
              fontWeight:"bold",
            }}
          >
            {item.status}
          </span>
        </p>

        <div
          style={{
            display:"flex",
            gap:"10px",
            marginTop:"15px",
          }}
        >
          <button
            onClick={()=>updateWithdrawal(item,"Approved")}
            disabled={item.status!=="Pending"}
          >
            ✅ Approve
          </button>

          <button
            onClick={()=>updateWithdrawal(item,"Rejected")}
            disabled={item.status!=="Pending"}
          >
            ❌ Reject
          </button>
        </div>

      </div>

    ))}

  </main>
);

}

function Card({
  title,
  value,
  color,
}:{
  title:string;
  value:any;
  color:string;
}){

  return(

    <div
      style={{
        background:"#0f172a",
        padding:"20px",
        borderRadius:"16px",
        border:"1px solid #334155",
      }}
    >
      <h3>{title}</h3>

      <h1
        style={{
          color,
          marginTop:"10px",
        }}
      >
        {value}
      </h1>

    </div>

  );

}