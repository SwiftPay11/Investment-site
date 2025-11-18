"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Load logged-in user from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("user");
    if (!stored) {
      setError("No logged-in user found. Please log in again.");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed?.id) {
        setError("Invalid user data. Please log in again.");
      } else {
        setUser(parsed);
      }
    } catch {
      setError("Invalid user data. Please log in again.");
    }
  }, []);

  const handleCreate = async () => {
    if (!user?.id || creating) return;

    setCreating(true);
    setError("");

    try {
      const res = await fetch(
        `http://192.168.1.87:5000/trading-accounts/create/${user.id}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to create account");
        throw new Error(msg || "Failed to create account");
      }

      // optional: const created = await res.json();
      alert("Trading account created successfully.");
      router.push("/dashboard");
    } catch (err) {
      console.error("Create trading account error:", err);
      setError(err.message || "Error creating trading account");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] flex items-center justify-center px-4 text-white">
      {/* Centered modal-style card */}
      <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-2xl shadow-xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Create Trading Account</h1>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-white/70 mb-4">
          This will create a new MT5 hedging trading account linked to your
          profile. You can fund and trade with it from your dashboard.
        </p>

        {/* Info preview */}
        <div className="space-y-3 text-sm mb-4 bg-white/5 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-white/60">Account type</span>
            <span className="font-medium">MT5 Hedging</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Leverage</span>
            <span className="font-medium">1:500</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Initial balance</span>
            <span className="font-medium">$0.00</span>
          </div>
        </div>

        {error && (
          <div className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded p-2">
            {error}
          </div>
        )}

        <button
          disabled={!user || creating}
          onClick={handleCreate}
          className={`w-full py-3 rounded-lg font-semibold text-black text-sm
            ${
              !user || creating
                ? "bg-blue-400/60 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 cursor-pointer"
            }`}
        >
          {creating ? "Creating account..." : "Create account"}
        </button>

        <button
          onClick={handleClose}
          className="mt-3 w-full py-2 text-xs text-white/60 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
