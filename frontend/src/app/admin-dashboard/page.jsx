"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) router.push("/admin-login");
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/users/all");
      const data = await res.json();
      const usersArray = Array.isArray(data) ? data : Array.isArray(data.users) ? data.users : [];
      setUsers(usersArray);
    } catch (_) {
      setUsers([]);
    }
  };

  // --- LOGIC KEPT EXACTLY SAME ---
  const handleReverse = async (userId) => {
    const amount = amounts[userId];
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");

    setLoading(`${userId}-reverse`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/users/admin/reverse-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: "admin@nexttrade.com",
          adminPassword: "admin123",
          userId,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Payment reversed!");
        fetchUsers();
      } else alert(data.message || "Failed");
    } catch (_) {
      alert("Error reversing payment.");
    } finally {
      setLoading(null);
    }
  };

  const fundUser = async (email) => {
    const amt = prompt("Enter amount to FUND user:");
    if (!amt || Number(amt) <= 0) return;

    setLoading(`${email}-fund`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/admin/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: Number(amt) }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User funded!");
        fetchUsers();
      } else alert(data.message);
    } catch {
      alert("Error.");
    } finally {
      setLoading(null);
    }
  };

  const resetBalance = async (email) => {
    if (!confirm("Reset this user's balance?")) return;

    setLoading(`${email}-reset`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/admin/reset-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Balance reset!");
        fetchUsers();
      } else alert(data.message);
    } catch {
      alert("Error.");
    } finally {
      setLoading(null);
    }
  };

  const restrictUser = async (email, restricted) => {
    setLoading(`${email}-restrict`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/admin/restrict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, restricted }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(restricted ? "User restricted" : "User unrestricted");
        fetchUsers();
      } else alert(data.message);
    } catch {
      alert("Error.");
    } finally {
      setLoading(null);
    }
  };

  const deleteUser = async (email) => {
    if (!confirm("Delete user permanently?")) return;

    setLoading(`${email}-delete`);
    try {
      const res = await fetch(
        `https://investment-site-x6tr.onrender.com/auth/admin/delete/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        alert("User deleted!");
        fetchUsers();
      } else alert(data.message);
    } catch {
      alert("Error.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-white p-6">

      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-wide text-blue-300">
          NexTrade Admin Dashboard
        </h1>

        <button
          onClick={() => router.push("/admin-dashboard/giftcards")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
        >
          Review Giftcards
        </button>
      </div>

      {/* ===== Card Container ===== */}
      <div className="max-w-7xl mx-auto bg-[#0b1224]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6">

        {/* === TABLE === */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm text-gray-400">
              <th className="py-3">Full Name</th>
              <th>Email</th>
              <th>Account</th>
              <th>Balance</th>
              <th className="text-center">Actions</th>
              <th className="text-center">Reverse</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const id = u.id;
                const balance = Number(u.balance ?? 0);

                return (
                  <tr
                    key={id}
                    className="border-b border-white/5 hover:bg-white/5 transition text-sm"
                  >
                    <td className="py-4">{u.fullname || "—"}</td>
                    <td>{u.email}</td>
                    <td>{u.accountNumber}</td>
                    <td className="text-green-400 font-medium">
                      ${balance.toFixed(2)}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 transition"
                          onClick={() => fundUser(u.email)}
                        >
                          Fund
                        </button>

                        <button
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
                          onClick={() => resetBalance(u.email)}
                        >
                          Reset
                        </button>

                        <button
                          className="px-3 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-400 transition"
                          onClick={() => restrictUser(u.email, !u.restricted)}
                        >
                          {u.restricted ? "Unrestrict" : "Restrict"}
                        </button>

                        <button
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 transition"
                          onClick={() => deleteUser(u.email)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <input
                          type="number"
                          placeholder="Amount"
                          className="w-24 px-2 py-1 bg-black/30 border border-white/10 rounded text-white"
                          value={amounts[id] ?? ""}
                          onChange={(e) =>
                            setAmounts({ ...amounts, [id]: e.target.value })
                          }
                        />

                        <button
                          onClick={() => handleReverse(id)}
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-400 transition"
                        >
                          Reverse
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
