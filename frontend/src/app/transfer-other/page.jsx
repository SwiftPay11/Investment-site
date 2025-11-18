"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Banknote, ShieldAlert, Loader2 } from "lucide-react";

export default function TransferOtherPage() {
  const [country, setCountry] = useState("");
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

 const [senderId, setSenderId] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return;

  const userObj = JSON.parse(storedUser);

  if (!userObj?.email) return;

  fetch(`http://192.168.1.87:5000/users/me-by-email/${userObj.email}`)
    .then(res => res.json())
    .then(data => {
      if (data?.id) setSenderId(data.id);
    })
    .catch(() => {});
}, []);

 
  const router = useRouter();

  // Detect user country
  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setCountry(data.country_name || "United States");
      } catch {
        setCountry("United States");
      }
    }
    detectCountry();
  }, []);

  // Load local banks.json
  useEffect(() => {
    async function loadBanks() {
      try {
        const res = await fetch(`${window.location.origin}/data/banks.json`);
        const data = await res.json();
        if (data[country]) setBanks(data[country]);
        else setBanks([]);
      } catch {
        setBanks([]);
      }
    }
    if (country) loadBanks();
  }, [country]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedBank || !accountNumber || !amount)
    return alert("Please fill all fields");

  setLoading(true);

  try {
    // ✅ Call your real backend transfer endpoint
    const response = await fetch("http://192.168.1.87:5000/users/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
  senderId: senderId, // replace with logged-in user's ID if available
  recipientAccount: accountNumber,
  recipientEmail: recipientEmail || null, // ✅ new
  amount: parseFloat(amount),
}),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Transfer failed");
    }

    // ✅ Trigger confetti & success popup
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setSuccessData({
      selectedBank,
      accountNumber,
      amount,
      date: new Date().toLocaleString(),
    });
  } catch (err) {
    console.error("Transfer error:", err);
    alert(err.message || "Transfer failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-[#0c0f25] text-white flex flex-col px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => router.push("/transfer")}
          className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#222] px-4 py-2 rounded-lg transition-all cursor-pointer"
        >
          <span className="text-xl">←</span>

        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all cursor-pointer"
        >
          <Banknote size={18} />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">Transfer to Bank</h1>
      <p className="text-gray-400 mb-8">
        Instantly send money from your NexTrade account to a local bank in{" "}
        <span className="text-green-400 font-medium">{country}</span>.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-2xl shadow-xl border border-gray-800 max-w-2xl mx-auto w-full"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Select Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="">-- Choose Bank --</option>
              {banks.map((bank, idx) => (
                <option key={idx} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Account Number
            </label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
  <label className="block text-sm mb-2 text-gray-300">
    Recipient Email (required)
  </label>
  <input
    value={recipientEmail}
    onChange={(e) => setRecipientEmail(e.target.value)}
    type="email"
    placeholder="Enter recipient email"
    className="w-full p-3 rounded-lg bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
              placeholder="Enter amount (USD)"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-gray-700 transition-all py-3 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Processing...
              </>
            ) : (
              "Send to Bank"
            )}
          </button>
        </div>
      </form>

      {/* Safety Warning */}
      <div className="bg-[#151515] border border-yellow-700 text-yellow-400 rounded-xl p-6 flex items-start gap-4 shadow-lg max-w-4xl mx-auto mt-12">
        <ShieldAlert size={24} />
        <p className="text-sm leading-relaxed">
          Ensure the account details are correct before confirming transfer.
          NexTrade is not responsible for funds sent to incorrect accounts.
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
                <span className="text-green-400">
                  {successData.selectedBank}
                </span>{" "}
                ({successData.accountNumber}) on {successData.date}
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
