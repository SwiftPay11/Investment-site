"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ===============================
// SUCCESS POPUP WITH CHECK + CONFETTI
// ===============================
function SuccessPopup({ amount, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="confetti-dot"
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDuration: 2 + Math.random() * 2 + "s",
              animationDelay: Math.random() * 1 + "s",
            }}
          />
        ))}
      </div>

      <div className="bg-[#13172f] border border-white/10 p-7 rounded-2xl text-center w-[85%] max-w-sm shadow-xl relative z-10">

        {/* Animated Check */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-pop shadow-lg shadow-green-500/40">
            <span className="text-white text-5xl">✓</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-green-400 mb-2">
          Withdrawal Successful
        </h2>

        <p className="text-gray-300 text-sm mb-3">
          You withdrew <span className="text-blue-300 font-semibold">${amount}</span> to PayPal.
        </p>

        <p className="text-xs text-gray-500 mb-4">
          {new Date().toLocaleString()}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-black transition"
        >
          Show Transaction Details
        </button>
      </div>
    </div>
  );
}

export default function WithdrawPayPal() {
  const router = useRouter();
  const [paypalEmail, setPaypalEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);


  const [recent, setRecent] = useState([]);
  const recentRef = useRef(null);

  // Fees
  const fee = amount ? (Number(amount) * 0.04 + 0.3).toFixed(2) : "0.00";
  const finalAmount = amount
    ? (Number(amount) - Number(fee)).toFixed(2)
    : "0.00";

  // Load Recent
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentWithdrawals") || "[]");
    setRecent(saved);
  }, []);

  // ============================
  // HANDLE WITHDRAW
  // ============================
  const handleWithdraw = async () => {
    if (!paypalEmail || !amount)
      return alert("Please fill all fields");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return alert("Not logged in");

    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.87:5000/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amount: Number(amount),
          paypalEmail,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);


// SAVE TO RECENT
// ============================

// 1️⃣ Create the REAL ID only once
const withdrawalId = Date.now().toString();

const entry = {
  id: withdrawalId,
  type: "PayPal",
  amount,
  email: paypalEmail,
  time: new Date().toLocaleString(),
  status: "Pending",
};

// Add to React state FIRST (reliable)
setRecent(prev => {
  const updated = [entry, ...prev];
  localStorage.setItem("recentWithdrawals", JSON.stringify(updated));
  return updated;
});

// Show popup
setShowSuccess(true);

// 3-MINUTE AUTO-APPROVE USING PURE MEMORY (not storage)
setTimeout(() => {
  setRecent(prev => {
    const updated = prev.map(w =>
      w.id === withdrawalId ? { ...w, status: "Approved" } : w
    );

    // (optional) Sync back to localStorage
    localStorage.setItem("recentWithdrawals", JSON.stringify(updated));

    return updated;
  });
}, 5000); 


    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0f25] text-white p-6 pb-24">
      <div className="max-w-lg mx-auto bg-[#13172f] p-6 rounded-2xl shadow-xl border border-white/10">

        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-300">
          Withdraw to PayPal
        </h1>

        {/* PayPal Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center overflow-hidden shadow-lg">
            <img
              src="/icons/paypal.png"
              alt="PayPal"
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        {/* PayPal Email */}
        <div className="bg-[#1b2140] border border-white/10 px-4 py-3 rounded-xl mb-5">
          <label className="text-xs text-gray-400">PayPal Email</label>
          <input
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="bg-transparent w-full outline-none text-white mt-1"
          />
        </div>

        {/* Amount */}
        <div className="bg-[#1b2140] border border-white/10 px-4 py-3 rounded-xl mb-5">
          <label className="text-xs text-gray-400">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-transparent w-full outline-none text-white mt-1 text-lg"
          />

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>PayPal Fee (4% + $0.30)</span>
            <span>- ${fee}</span>
          </div>

          <div className="flex justify-between text-sm text-blue-300 mt-2">
            <span>You’ll receive</span>
            <span className="font-semibold">${finalAmount}</span>
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold text-black mt-3 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Withdraw to PayPal"}
        </button>

        <button
          onClick={() => router.push("/withdraw")}
          className="w-full mt-4 text-blue-400 text-sm text-center hover:underline"
        >
          Back
        </button>
      </div>

      {/* ===============================
          RECENT WITHDRAWALS
      =============================== */}
      <div ref={recentRef} className="max-w-lg mx-auto mt-10">
        <h2 className="text-lg font-semibold text-blue-300 mb-3">
          Recent Withdrawals
        </h2>

        {recent.filter((x) => x.type === "PayPal").length === 0 ? (
          <p className="text-gray-400 text-sm">No PayPal withdrawals yet</p>
        ) : (
          <div className="space-y-3">
            {recent
              .filter((x) => x.type === "PayPal")
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-[#13172f] border border-white/10 p-4 rounded-xl"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-blue-300">
                        ${item.amount}
                      </p>
                      <p className="text-sm text-gray-400">
                        PayPal • {item.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.time}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-xl transition-colors duration-500 ${
                        item.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-300 animate-pulse"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                 <button
  onClick={() => {
    setSelectedWithdrawal(item);
    setShowDetails(true);
  }}
  className="text-blue-400 text-xs mt-2 hover:underline"
>
  View Details
</button>

                </div>
              ))}
          </div>
        )}
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <SuccessPopup
          amount={amount}
          onClose={() => {
            setShowSuccess(false);
            setTimeout(() => {
              recentRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 150);
          }}
        />
      )}

    
     {showDetails && selectedWithdrawal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fadeIn z-50">
    <div className="bg-[#13172f] p-6 rounded-xl border border-white/10 max-w-sm w-full animate-slideUp">

      {/* Header */}
      <h2 className="text-xl font-semibold mb-3 text-blue-300 text-center">
        Withdrawal Details
      </h2>

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <img
          src={
            selectedWithdrawal.coin
              ? `/icons/${selectedWithdrawal.coin.toLowerCase()}.png`
              : "/icons/paypal.png"
          }
          alt="icon"
          className="w-14 h-14 opacity-90"
        />
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-300">

        {selectedWithdrawal.email && (
          <p>
            <span className="text-gray-400">PayPal Email:</span>{" "}
            {selectedWithdrawal.email}
          </p>
        )}

        {selectedWithdrawal.address && (
          <p>
            <span className="text-gray-400">Wallet:</span>{" "}
            {selectedWithdrawal.address}
          </p>
        )}

        <p>
          <span className="text-gray-400">Amount:</span>{" "}
          <span className="font-semibold text-blue-300">
            {selectedWithdrawal.amount}{" "}
            {selectedWithdrawal.coin ? selectedWithdrawal.coin : "USD"}
          </span>
        </p>

        {selectedWithdrawal.fee && (
          <p>
            <span className="text-gray-400">Fee:</span>{" "}
            {selectedWithdrawal.fee}
          </p>
        )}

        {selectedWithdrawal.finalAmount && (
          <p>
            <span className="text-gray-400">You’ll receive:</span>{" "}
            <span className="text-green-300">{selectedWithdrawal.finalAmount}</span>
          </p>
        )}

        <p>
          <span className="text-gray-400">Status:</span>{" "}
          {selectedWithdrawal.status === "Pending" ? (
            <span className="text-yellow-300">Pending</span>
          ) : (
            <span className="text-green-300">Approved</span>
          )}
        </p>

        <p>
          <span className="text-gray-400">Requested:</span>{" "}
          {selectedWithdrawal.time}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setShowDetails(false)}
        className="w-full mt-6 bg-blue-500 py-2 rounded-lg hover:bg-blue-600 text-black font-semibold"
      >
        Close
      </button>
    </div>
  </div>
)}



      {/* Confetti + animations */}
      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          80% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pop {
          animation: pop 0.35s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }

        @keyframes confetti-fall {
          from {
            transform: translateY(-10vh) rotate(0deg);
          }
          to {
            transform: translateY(110vh) rotate(360deg);
          }
        }
        .confetti-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #facc15;
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .confetti-dot:nth-child(4n) {
          background: #22c55e;
        }
        .confetti-dot:nth-child(4n + 1) {
          background: #38bdf8;
        }
        .confetti-dot:nth-child(4n + 2) {
          background: #f97316;
        }
        .confetti-dot:nth-child(4n + 3) {
          background: #e11d48;
        }
      `}</style>
    </div>
  );
}
