"use client";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white p-6">
      <div className="max-w-md mx-auto bg-[#0b122a] p-6 rounded-xl border border-blue-900/40 shadow-xl">

        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-300">
          Choose Withdrawal Method
        </h1>

        <div className="space-y-4">

          {/* Crypto Withdrawal */}
          <button
            onClick={() => router.push("/withdraw/crypto")}
            className="w-full bg-[#111a3e] hover:bg-[#1a2658] border border-blue-800 text-left px-4 py-4 rounded-xl transition"
          >
            <h2 className="font-semibold text-lg text-blue-300">Withdraw to Crypto Wallet</h2>
            <p className="text-gray-400 text-sm mt-1">Send crypto to your wallet</p>
          </button>

          {/* PayPal Withdrawal */}
          <button
            onClick={() => router.push("/withdraw/paypal")}
            className="w-full bg-[#111a3e] hover:bg-[#1a2658] border border-blue-800 text-left px-4 py-4 rounded-xl transition"
          >
            <h2 className="font-semibold text-lg text-blue-300">Withdraw to PayPal</h2>
            <p className="text-gray-400 text-sm mt-1">Withdraw funds to a PayPal account</p>
          </button>

        </div>
      </div>
    </div>
  );
}
