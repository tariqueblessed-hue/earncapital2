"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  balance: number;
  is_activated: boolean;
  fee_paid: boolean;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      window.location.href = "/login";
      return;
    }

    // ONLY THIS EMAIL CAN ACCESS ADMIN
    if (
      user.email.toLowerCase() !==
      "tariqueblessed@gmail.com"
    ) {
      alert("⛔ Access Denied");
      window.location.href = "/dashboard";
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("email", user.email)
      .single();

    if (error || !data) {
      alert("Unable to load admin account.");
      return;
    }

    setAdminName(data.username);

    await loadUsers();

    setLoading(false);
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("username");

    if (error) {
      alert(error.message);
      return;
    }

    setUsers((data as User[]) || []);
  }

  async function updateBalance(userId: string) {
    const balance = Number(newBalance);

    if (newBalance.trim() === "" || isNaN(balance)) {
      alert("Enter a valid balance.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        balance,
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Balance updated successfully!");

    setEditingUser(null);
    setNewBalance("");

    await loadUsers();
  }

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (u) => u.is_activated
  ).length;

  const totalBalance = users.reduce(
    (sum, u) => sum + Number(u.balance || 0),
    0
  );

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontSize: "22px",
          textAlign: "center",
        }}
      >
        Loading Admin Panel...
      </div>
    );
  }return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "30px",
      }}
    >
      <h1
        style={{
          marginBottom: "5px",
          fontSize: "34px",
          fontWeight: "bold",
        }}
      >
        👑 EarnCapital Admin Panel
      </h1>

      <p
        style={{
          color: "#64748b",
          marginBottom: "30px",
        }}
      >
        Welcome back,
        <strong> {adminName}</strong>
      </p>

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(230px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={card}>
          <h3>Total Users</h3>

          <h1>{totalUsers}</h1>
        </div>

        <div style={card}>
          <h3>Activated Users</h3>

          <h1>{activeUsers}</h1>
        </div>

        <div style={card}>
          <h3>Total Balance</h3>

          <h1>
            KES {totalBalance.toLocaleString()}
          </h1>
        </div>

        <div style={card}>
          <h3>Administrator</h3>

          <h2>👑 Super Admin</h2>
        </div>
      </div>

      {/* Quick Links */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <a
          href="/admin/deposits"
          style={linkCard}
        >
          💳 Deposit Requests
        </a>

        <a
          href="/admin/withdrawals"
          style={linkCard}
        >
          💸 Withdrawal Requests
        </a>

        <a
          href="/admin/activation-requests"
          style={linkCard}
        >
          🔐 Activation Requests
        </a>

        <a
          href="/dashboard"
          style={linkCard}
        >
          🏠 User Dashboard
        </a>
      </div>

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Registered Users
      </h2>

      <div
        style={{
          overflowX: "auto",
          background: "white",
          borderRadius: "15px",
          boxShadow:
            "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              background: "#2563eb",
              color: "white",
            }}
          >
            <tr>
              <th style={th}>Username</th>

              <th style={th}>Email</th>

              <th style={th}>Phone</th>

              <th style={th}>Balance</th>

              <th style={th}>Activated</th>

              <th style={th}>Fee Paid</th>

              <th style={th}>Role</th>

              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={td}>
                  {user.username}
                </td>

                <td style={td}>
                  {user.email}
                </td>

                <td style={td}>
                  {user.phone}
                </td><td style={td}>
                  {editingUser === user.id ? (
                    <input
                      type="number"
                      value={newBalance}
                      onChange={(e) =>
                        setNewBalance(e.target.value)
                      }
                      style={{
                        width: "120px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <>KES {Number(user.balance).toLocaleString()}</>
                  )}
                </td>

                <td style={td}>
                  {user.is_activated ? "✅" : "❌"}
                </td>

                <td style={td}>
                  {user.fee_paid ? "✅" : "❌"}
                </td>

                <td style={td}>
                  {user.email ===
                  "tariqueblessed@gmail.com"
                    ? "👑 Super Admin"
                    : "👤 Member"}
                </td>

                <td style={td}>
                  {editingUser === user.id ? (
                    <>
                      <button
                        onClick={() =>
                          updateBalance(user.id)
                        }
                        style={saveButton}
                      >
                        Update
                      </button>

                      <button
                        onClick={() => {
                          setEditingUser(null);
                          setNewBalance("");
                        }}
                        style={cancelButton}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setNewBalance(
                          String(user.balance)
                        );
                      }}
                      style={editButton}
                    >
                      Edit Balance
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const card = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  textAlign: "center" as const,
};

const linkCard = {
  background: "#2563eb",
  color: "white",
  padding: "18px",
  borderRadius: "14px",
  textDecoration: "none",
  textAlign: "center" as const,
  fontWeight: "bold",
  fontSize: "16px",
  boxShadow: "0 8px 18px rgba(37,99,235,.25)",
};

const th = {
  padding: "15px",
  border: "1px solid #e2e8f0",
};

const td = {
  padding: "12px",
  border: "1px solid #e2e8f0",
  textAlign: "center" as const,
};

const editButton = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const saveButton = {
  padding: "8px 14px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "8px",
};

const cancelButton = {
  padding: "8px 14px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};