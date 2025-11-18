"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ShieldAlert, History } from "lucide-react";

export default function TransferPage() {
  const [toEmail, setToEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [successData, setSuccessData] = useState(null);
  const router = useRouter();

  // Fetch recent transactions (real PostgreSQL API)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;
    fetch(`http://192.168.1.87:5000/wallet/transactions/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        // Safely handle data no matter its shape
        const txs = Array.isArray(data)
          ? data
          : Array.isArray(data?.transactions)
          ? data.transactions
          : [];
        setTransactions(txs);
      })
      .catch(() => setTransactions([]));
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return alert("Not logged in");

    setLoading(true);
    try {
      const res = await fetch("http://192.168.1.87:5000/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  fromUserId: user.id,
  toUserEmail: toEmail,
  recipientEmail: toEmail, // ✅ Added for email alert
  amount: Number(amount),
}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Transfer failed");

      const updatedUser = { ...user, balance: Number(json.data.from.balance) };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setSuccessData({
        toEmail,
        amount,
        date: new Date().toLocaleString(),
      });
    } catch (err) {
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtherTransfer = () => {
    router.push("/transfer-other");
  };

  return (
    <div className="min-h-screen bg-[#0c0f25] text-white flex flex-col px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        {/* Creative back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#1c1c1c] hover:bg-[#222] to-emerald-600 text-white px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition-all cursor-pointer shadow-lg"
        >
          ←
        </button>

        <button
          onClick={() => router.push("/transactions")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all cursor-pointer"
        >
          <History size={18} />
          <span>Transaction History</span>
        </button>
      </div>

      {/* Main Transfer Area */}
      <h1 className="text-3xl font-bold mb-2">Transfer Funds</h1>
      <p className="text-gray-400 mb-8">
        Send money instantly to another NexTrade user or external account.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Transfer Form */}
        <form
          onSubmit={handleTransfer}
          className="bg-[#121212] p-8 rounded-2xl shadow-xl border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-6">To NexTrade Account</h2>
          <div className="space-y-4">
            <input
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="Recipient Email"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
              placeholder="Amount (USD)"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              className="w-full bg-blue-600 hover:bg-gray-700 transition-all py-3 rounded-lg font-semibold cursor-pointer"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Funds"}
            </button>
          </div>
          <div className="mt-5 text-center">
            <button
              onClick={handleOtherTransfer}
              type="button"
              className="w-full py-3 rounded-lg font-semibold text-white bg-blue-500 to-emerald-600 hover:opacity-90 transition-all cursor-pointer shadow-md"
            >
              Transfer to Other Account ✨
            </button>
          </div>
        </form>

        {/* Recent Transactions */}
        <div className="bg-[#121212] p-8 rounded-2xl shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            <ul className="space-y-3">
              {transactions.slice(0, 5).map((tx, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-3 bg-[#1c1c1c] rounded-lg"
                >
                  <div>
                    <p className="text-sm text-gray-300">
                      To: {tx.toEmail || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <span className="text-green-400 font-semibold">
                    -${tx.amount}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-[#151515] border border-yellow-700 text-yellow-400 rounded-xl p-6 flex items-start gap-4 shadow-lg max-w-4xl mx-auto">
        <ShieldAlert size={24} />
        <p className="text-sm leading-relaxed">
          Always double-check the recipient details before confirming your
          transfer. CryptoFx is not responsible for funds sent to incorrect
          accounts.
        </p>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {successData && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 90 }}
            className="fixed bottom-0 left-0 w-full flex justify-center px-5 pb-10"
          >
            <div className="bg-[#0c0f25] border border-blue-700 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-3xl"
                >
                  ✓
                </motion.span>
              </motion.div>
              <h2 className="text-xl font-bold mb-2">Transfer Successful!</h2>
              <p className="text-gray-400 mb-4">
                You sent{" "}
                <span className="text-green-400">${successData.amount}</span> to{" "}
                <span className="text-green-400">{successData.toEmail}</span>
                <br />
                on {successData.date}
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-gray-700 transition-all font-semibold"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
