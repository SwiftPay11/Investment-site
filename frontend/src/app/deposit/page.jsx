"use client";

import { useRouter } from "next/navigation";

export default function DepositPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0c0f25] text-white p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-blue-300 mb-10">
        Deposit Funds
      </h1>

      <div className="max-w-lg mx-auto space-y-6">

        {/* Crypto Deposit */}
        <div
          onClick={() => router.push("/deposit/crypto")}
          className="cursor-pointer bg-[#13172f] border border-white/10 p-6 rounded-2xl shadow-lg hover:bg-[#1a1f3d] transition-all flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-black/20 flex items-center justify-center overflow-hidden">
            <img
              src="/icons/crypto.png"
              className="w-10 h-10 opacity-90"
              alt="Crypto"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-300">
              Deposit with Crypto
            </h2>
            <p className="text-gray-400 text-sm">
              Send cryptocurrency to your SwiftPay wallet.
            </p>
          </div>
        </div>

        {/* Giftcard Deposit */}
        <div
          onClick={() => router.push("/deposit/giftcard")}
          className="cursor-pointer bg-[#13172f] border border-white/10 p-6 rounded-2xl shadow-lg hover:bg-[#1a1f3d] transition-all flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-black/20 flex items-center justify-center overflow-hidden">
            <img
              src="/icons/giftcard.png"
              className="w-10 h-10 opacity-90"
              alt="Giftcard"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-300">
              Deposit with Giftcard
            </h2>
            <p className="text-gray-400 text-sm">
              Redeem supported giftcards to fund your account.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-10 w-full max-w-lg mx-auto block text-center text-blue-400 hover:underline"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
