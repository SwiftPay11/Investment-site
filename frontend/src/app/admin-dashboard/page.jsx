"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [amounts, setAmounts] = useState({}); // per-user reverse amount
  const [loading, setLoading] = useState(null); // store current loading key (e.g. `${id}-fund`)
  const router = useRouter();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) router.push("/admin-login");
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Fetch users (handles several response shapes)
  // ============================================
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/users/all");
      const data = await res.json();

      const usersArray = Array.isArray(data)
        ? data
        : Array.isArray(data.users)
        ? data.users
        : [];

      setUsers(usersArray);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    }
  };

  // ============================================
  // Reverse Payment (existing)
  // ============================================
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
          adminPassword: "erimogar",
          userId,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Payment reversed successfully and refund email sent!");
        fetchUsers();
      } else {
        alert("❌ Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Reverse error:", err);
      alert("❌ An error occurred while reversing payment.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // FUND user
  // (POST /auth/admin/fund) body: { email, amount }
  // ============================================
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
        alert("✅ User funded successfully!");
        fetchUsers();
      } else {
        alert("❌ Funding failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Fund error:", err);
      alert("❌ Error funding user.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // RESET BALANCE
  // (POST /auth/admin/reset-balance) body: { email }
  // ============================================
  const resetBalance = async (email) => {
    if (!confirm("Are you sure you want to RESET this user's balance?")) return;

    setLoading(`${email}-reset`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/admin/reset-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Balance reset successfully!");
        fetchUsers();
      } else {
        alert("❌ Reset failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("❌ Error resetting balance.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // RESTRICT / UNRESTRICT USER
  // (POST /auth/admin/restrict) body: { email, restricted }
  // ============================================
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
        alert(`✅ User ${restricted ? "restricted" : "unrestricted"} successfully!`);
        fetchUsers();
      } else {
        alert("❌ Restriction failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Restrict error:", err);
      alert("❌ Error updating restriction.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // DELETE USER
  // (DELETE /auth/admin/delete/:email)
  // ============================================
  const deleteUser = async (email) => {
    if (!confirm("Are you sure you want to DELETE this user?")) return;

    setLoading(`${email}-delete`);
    try {
      const res = await fetch(`https://investment-site-x6tr.onrender.com/auth/admin/delete/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ User deleted successfully!");
        fetchUsers();
      } else {
        alert("❌ Delete failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Error deleting user.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // RENDER UI
  // ============================================
  return (
    <div className="min-h-screen bg-[#0d243a] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">NextTrade Admin Dashboard</h1>

      <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-sm text-gray-300">
              <th className="py-2">Full Name</th>
              <th>Email</th>
              <th>Account</th>
              <th>Balance</th>
              <th>Actions</th>
              <th>Reverse Payment</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => {
                // normalize fields safely
                const id = u.id;
                const fullname = u.fullname || u.name || "—";
                const email = u.email || "";
                const account = u.accountNumber || email || "—";
                const balance = Number(u.balance ?? 0);
                const restricted = Boolean(u.restricted);

                return (
                  <tr key={id ?? email} className="border-b border-gray-700 hover:bg-gray-700 text-sm">
                    <td className="py-3">{fullname}</td>
                    <td>{email}</td>
                    <td>{account}</td>
                    <td>${balance.toFixed(2)}</td>

                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 bg-green-600 rounded"
                          onClick={() => fundUser(email)}
                          disabled={loading === `${email}-fund`}
                        >
                          {loading === `${email}-fund` ? "..." : "Fund"}
                        </button>

                        <button
                          className="px-2 py-1 bg-blue-600 rounded"
                          onClick={() => resetBalance(email)}
                          disabled={loading === `${email}-reset`}
                        >
                          {loading === `${email}-reset` ? "..." : "Reset"}
                        </button>

                        <button
                          className="px-2 py-1 bg-yellow-500 text-black rounded"
                          onClick={() => restrictUser(email, !restricted)}
                          disabled={loading === `${email}-restrict`}
                        >
                          {loading === `${email}-restrict` ? "..." : restricted ? "Unrestrict" : "Restrict"}
                        </button>

                        <button
                          className="px-2 py-1 bg-red-600 rounded"
                          onClick={() => deleteUser(email)}
                          disabled={loading === `${email}-delete`}
                        >
                          {loading === `${email}-delete` ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={amounts[id] ?? ""}
                          onChange={(e) => setAmounts({ ...amounts, [id]: e.target.value })}
                          className="w-24 p-1 rounded bg-gray-600 text-white text-sm"
                        />

                        <button
                          onClick={() => handleReverse(id)}
                          disabled={loading === `${id}-reverse`}
                          className={`${
                            loading === `${id}-reverse` ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
                          } text-white text-sm px-3 py-1 rounded`}
                        >
                          {loading === `${id}-reverse` ? "Reversing..." : "Reverse"}
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
