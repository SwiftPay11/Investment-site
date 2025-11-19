"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// How long before a withdrawal auto-approves (2 minutes)
const APPROVAL_DELAY_MS = 120000;

// ✅ Success Popup with check + confetti
function SuccessPopup({ amount, coin, network, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
      {/* Confetti layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
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
          You withdrew{" "}
          <span className="font-semibold text-blue-300">
            {amount} {coin}
          </span>{" "}
          via {network}.
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

// Helper: compute statuses based on timestamps
function applyTimeBasedStatus(list) {
  const now = Date.now();
  let changed = false;

  const updated = list.map((item) => {
    if (item.status !== "Pending") return item;

    // Backwards compatibility: if autoApproveAt not stored before,
    // derive it from createdAt, otherwise leave as pending.
    const autoApproveAt =
      item.autoApproveAt ??
      (item.createdAt ? item.createdAt + APPROVAL_DELAY_MS : null);

    if (autoApproveAt && now >= autoApproveAt) {
      changed = true;
      return { ...item, status: "Approved" };
    }

    return { ...item, autoApproveAt }; // ensure field exists
  });

  return { updated, changed };
}

export default function WithdrawCrypto() {
  const router = useRouter();

  const [coin, setCoin] = useState("USDT");
  const [network, setNetwork] = useState("TRC20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [showAssets, setShowAssets] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [recent, setRecent] = useState([]);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  // For scroll to "Recent Withdrawals"
  const recentRef = useRef(null);

  const coins = [
    { symbol: "USDT", networks: ["TRC20", "ERC20", "BEP20"] },
    { symbol: "BTC", networks: ["BTC"] },
    { symbol: "ETH", networks: ["ERC20"] },
    { symbol: "SOL", networks: ["SOL"] },
    { symbol: "BNB", networks: ["BEP20"] },
  ];

  const selectedCoin = coins.find((c) => c.symbol === coin);

  const fee = amount ? (Number(amount) * 0.005).toFixed(2) : "0.00";
  const finalAmount = amount
    ? (Number(amount) - Number(fee)).toFixed(2)
    : "0.00";

  // -------------------------------
  // LOAD RECENT WITHDRAWALS + FIX STATUS BY TIME
  // -------------------------------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("recentWithdrawals") || "[]");
      const { updated, changed } = applyTimeBasedStatus(saved);
      setRecent(updated);
      if (changed) {
        localStorage.setItem("recentWithdrawals", JSON.stringify(updated));
      }
    } catch {
      setRecent([]);
    }
  }, []);

  // -------------------------------
  // INTERVAL: KEEP STATUS IN SYNC EVEN IF TAB STAYS OPEN
  // -------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setRecent((prev) => {
        const { updated, changed } = applyTimeBasedStatus(prev);
        if (changed) {
          localStorage.setItem("recentWithdrawals", JSON.stringify(updated));
        }
        return updated;
      });
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // -------------------------------
  // HANDLE WITHDRAW
  // -------------------------------
  const handleWithdraw = async () => {
    if (!address || !amount) return alert("Please fill all fields");

    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amount: Number(amount),
          network,
          address,
          coin,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // ============================
      // SAVE TO RECENT WITHDRAWALS (timestamp-based)
      // ============================
      const now = Date.now();
      const withdrawalId = now.toString();

      const entry = {
        id: withdrawalId,
        coin,
        network,
        address,
        amount,
        time: new Date(now).toLocaleString(),
        status: "Pending",
        createdAt: now,
        autoApproveAt: now + APPROVAL_DELAY_MS,
      };

      setRecent((prev) => {
        const updated = [entry, ...prev];
        localStorage.setItem("recentWithdrawals", JSON.stringify(updated));
        return updated;
      });

      // Show success popup
      setShowSuccess(true);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const coinIconSrc = (symbol) => {
    if (!symbol) return "/icons/default.png"; // fallback icon
    return `/icons/${symbol.toLowerCase()}.png`;
  };

  return (
    <div className="min-h-screen bg-[#0c0f25] text-white p-6">
      <div className="max-w-lg mx-auto bg-[#13172f] p-6 rounded-2xl shadow-xl border border-white/10">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-300">
          Withdraw Crypto
        </h1>

        {/* Select Coin */}
        <div
          onClick={() => setShowAssets(true)}
          className="bg-[#1b2140] border border-white/10 px-4 py-3 rounded-xl mb-4 cursor-pointer"
        >
          <label className="text-xs text-gray-400">Asset</label>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-3">
              {/* Coin Icon (Binance style round) */}
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center overflow-hidden">
                <img
                  src={coinIconSrc(coin)}
                  alt={coin}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-lg font-semibold">{coin}</span>
            </div>
            <span className="text-gray-400 text-sm">Change</span>
          </div>
        </div>

        {/* Select Network */}
        <div className="bg-[#1b2140] border border-white/10 px-4 py-3 rounded-xl mb-4">
          <label className="text-xs text-gray-400">Network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="mt-1 w-full bg-transparent outline-none text-white text-lg"
          >
            {selectedCoin.networks.map((n) => (
              <option key={n} value={n} className="text-black">
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Wallet Address */}
        <div className="bg-[#1b2140] border border-white/10 px-4 py-3 rounded-xl mb-4">
          <label className="text-xs text-gray-400">Wallet Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="bg-transparent w-full outline-none text-white mt-1"
          />
        </div>

        {/* Amount */}
        <div className="bg-[#1b2140] border border-white/10 px-4 py-3 rounded-xl mb-4">
          <label className="text-xs text-gray-400">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-transparent w-full outline-none text-white mt-1 text-lg"
          />

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Fee (0.5%)</span>
            <span>
              - {fee} {coin}
            </span>
          </div>

          <div className="flex justify-between text-sm text-blue-300 mt-2">
            <span>You’ll receive</span>
            <span className="font-semibold">
            ${finalAmount}
            </span>
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold text-black mt-3 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>

        <button
          onClick={() => router.push("/withdraw")}
          className="w-full mt-3 text-blue-400 text-sm text-center hover:underline"
        >
          Back
        </button>
      </div>

      {/* ==============================
          RECENT WITHDRAWALS SECTION
      =============================== */}
      <div ref={recentRef} className="max-w-lg mx-auto mt-8">
        <h2 className="text-lg font-semibold text-blue-300 mb-3">
          Recent Withdrawals
        </h2>

        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent withdrawals</p>
        ) : (
          <div className="space-y-3">
            {recent.map((item) => (
              <div
                key={item.id}
                className="bg-[#13172f] border border-white/10 p-4 rounded-xl"
              >
                <div className="flex justify-between">
                  <div className="flex items-start gap-3">
                    {/* Icon in list */}
                    <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center overflow-hidden mt-1">
                      <img
                        src={coinIconSrc(item.coin)}
                        alt={item.coin}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-300">
                        ${item.amount}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.network} •{" "}
                        {item.address
                          ? `${item.address.slice(0, 6)}...${item.address.slice(-4)}`
                          : "Address"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
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

      {/* SUCCESS POPUP WITH CHECK + CONFETTI */}
      {showSuccess && (
        <SuccessPopup
          amount={amount}
          coin={coin}
          network={network}
          onClose={() => {
            setShowSuccess(false);
            // scroll to recent withdrawals
            setTimeout(() => {
              recentRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        />
      )}

      {/* WITHDRAWAL DETAILS MODAL */}
      {showDetails && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fadeIn">
          <div className="bg-[#13172f] w-full max-w-sm p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-2 text-blue-300 text-center">
              Withdrawal Details
            </h2>

            <div className="space-y-2 text-sm text-gray-300 mt-4">
              <p>
                <span className="text-gray-400">Coin:</span>{" "}
                {selectedWithdrawal.coin}
              </p>
              <p>
                <span className="text-gray-400">Network:</span>{" "}
                {selectedWithdrawal.network}
              </p>
              <p>
                <span className="text-gray-400">Amount:</span>
                <span className="font-semibold text-blue-300 ml-1">
                  {selectedWithdrawal.amount} {selectedWithdrawal.coin}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Address:</span>
                <span className="ml-1">{selectedWithdrawal.address}</span>
              </p>
              <p>
                <span className="text-gray-400">Status:</span>
                {selectedWithdrawal.status === "Pending" ? (
                  <span className="ml-1 text-yellow-300">Pending</span>
                ) : (
                  <span className="ml-1 text-green-300">Approved</span>
                )}
              </p>
              <p>
                <span className="text-gray-400">Requested:</span>{" "}
                {selectedWithdrawal.time}
              </p>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full mt-6 bg-blue-500 py-2 rounded-lg hover:bg-blue-600 text-black font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ASSET SELECTOR MODAL */}
      {showAssets && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end">
          <div className="bg-[#1b2140] w-full max-w-lg p-5 rounded-t-2xl border-t border-white/10">
            <h2 className="text-center text-lg text-blue-300 mb-4">
              Select Asset
            </h2>

            <div className="space-y-2">
              {coins.map((c) => (
                <div
                  key={c.symbol}
                  onClick={() => {
                    setCoin(c.symbol);
                    setNetwork(c.networks[0]);
                    setShowAssets(false);
                  }}
                  className="px-4 py-3 bg-[#13172f] rounded-xl border border-white/10 cursor-pointer hover:bg-[#1e2450] flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center overflow-hidden">
                    <img
                      src={coinIconSrc(c.symbol)}
                      alt={c.symbol}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span>{c.symbol}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAssets(false)}
              className="w-full text-center text-gray-400 mt-4 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Global styles for animation & confetti */}
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
