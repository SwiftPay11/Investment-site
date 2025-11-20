"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export default function CreateAccountPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false); // ✅ NEW

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
        `https://investment-site-x6tr.onrender.com/trading-accounts/create/${user.id}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to create account");
        throw new Error(msg || "Failed to create account");
      }

      // ⭐ SUCCESS POPUP
      setSuccessPopup(true);
      setTimeout(() => router.push("/dashboard"), 3000);

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
     
      {/* SUCCESS POPUP */}
{successPopup && (
  <>
    <Confetti numberOfPieces={220} recycle={false} />

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="w-[90%] max-w-sm bg-gradient-to-b from-[#0a0f29] to-[#020817] border border-white/10 shadow-2xl rounded-2xl p-6 text-center animate-fadeIn">

        {/* Circular Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center mb-4 animate-pop">
          <span className="text-4xl text-green-400 font-bold">✓</span>
        </div>

        <h2 className="text-xl font-semibold text-white">Account Created</h2>

        <p className="text-white/60 mt-1 text-sm">
          Your new MT5 trading account is ready. Redirecting…
        </p>
      </div>
    </div>

    <style jsx>{`
      @keyframes fadeIn {
        0% { opacity: 0; transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
      .animate-fadeIn { animation: fadeIn 0.3s ease-out; }

      @keyframes pop {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-pop { animation: pop 0.35s ease-out; }
    `}</style>
  </>
)}

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
