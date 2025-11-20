"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export default function MainBalanceDeposit() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [successPopup, setSuccessPopup] = useState(false); // ⭐ NEW

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleTransfer = async () => {
    if (!amount || !user?.id) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://investment-site-x6tr.onrender.com/wallet/transfer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            amount: Number(amount),
            from: "main",
            to: "trading",
          }),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Transfer failed");
      }

      // ⭐ SHOW SUCCESS POPUP
      setSuccessPopup(true);
      setTimeout(() => router.push("/dashboard"), 2500);

    } catch (err) {
      setError(err.message || "Error processing transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f25] text-white p-6">

      {/* ⭐ SUCCESS POPUP */}
      {successPopup && (
        <>
          <Confetti numberOfPieces={200} recycle={false} />

          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="w-[90%] max-w-sm bg-gradient-to-b from-[#0a0f29] to-[#020817] border border-white/10 shadow-2xl rounded-2xl p-6 text-center animate-fadeIn">

              <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center mb-4 animate-pop">
                <span className="text-4xl text-green-400 font-bold">✓</span>
              </div>

              <h2 className="text-xl font-semibold text-white">Transfer Successful</h2>

              <p className="text-white/60 mt-1 text-sm">
                Funds moved from main balance to trading account.
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
              100% { transform: scale(1); opacity: 1); }
            }
            .animate-pop { animation: pop 0.35s ease-out; }
          `}</style>
        </>
      )}

      <h1 className="text-3xl font-bold text-center text-blue-300 mb-10">
        Fund from Main Balance
      </h1>

      <div className="max-w-lg mx-auto bg-[#13172f] p-6 rounded-2xl border border-white/10 shadow-xl">

        <label className="block mb-3 text-blue-300">Enter Amount</label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/30 border border-white/10 text-white focus:border-blue-400 outline-none"
          placeholder="0.00"
        />

        {error && (
          <p className="text-red-400 text-sm mt-3 bg-red-500/10 p-2 rounded">
            {error}
          </p>
        )}

        <button
          onClick={handleTransfer}
          disabled={!amount || loading}
          className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Processing..." : "Transfer to Trading Account"}
        </button>

        <button
          onClick={() => router.back()}
          className="mt-3 w-full text-blue-300 hover:underline"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
