"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CRYPTOS = [
  { name: "BTC", logo: "/icons/btc.png" },
  { name: "ETH", logo: "/icons/eth.png" },
  { name: "USDT", logo: "/icons/usdt.png" },
  { name: "BNB", logo: "/icons/bnb.png" },
  { name: "SOL", logo: "/icons/sol.png" },
  { name: "1INCH", logo: "/icons/1inch.png" },
  { name: "AAVE", logo: "/icons/aave.png" },
  { name: "XRP", logo: "/icons/xrp.png" },
  { name: "TRX", logo: "/icons/trx.png" },
  { name: "USDC", logo: "/icons/usdc.png" },
  { name: "HMSTR", logo: "/icons/hmstr.png" },
  { name: "SNK", logo: "/icons/snk.png" },
  { name: "SWPA", logo: "/icons/swiftpay.png" },
  { name: "MNT" },
  { name: "1SOL" },
  { name: "3P" },
  { name: "5IRE" },
  { name: "A" },
  { name: "A8" },
  { name: "AAPLX" },
  { name: "AARK" },
  { name: "ACA" },
];

const SUPPORTED = {
  BTC: {
    address: "bc1qjwn4s3yjgcj8z9h0wf9e6p3flkngl70lgrz8kd",
    qr: "/icons/qr-btcc.png",
  },
  ETH: {
    address: "0xE6c23E72435E009AF043fBF6A48140d4167DAdd8",
    qr: "/icons/qr-eth.png",
  },
  USDT: {
    address: "0xE6c23E72435E009AF043fBF6A48140d4167DAdd8",
    qr: "/icons/qr-usdt.png",
  },
  BNB: {
    address: "bnb1x64nfps5z62xpe0frkgllvnfd7m244pyqnf4s7",
    qr: "/icons/qr-bnb.png",
  },
  SOL: {
    address: "CyUkoCxG9ZpQnsWB1toF4HCiLk3FE7bSadfWNNm63DD5",
    qr: "/icons/qr-sol.png",
  },
};

export default function DepositCrypto() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Crypto");
  const [copied, setCopied] = useState(false);

  const filtered = CRYPTOS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClick = (crypto) => {
    setSelected(crypto);
    setOpen(true);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!selected) return;
    const text = SUPPORTED[selected.name]?.address;
    if (!text) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const isSupported = selected && SUPPORTED[selected.name];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#050a1a] to-[#050816] text-white px-4 py-6">
      {/* Top bar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="text-indigo-400 flex items-center gap-1 text-sm hover:text-indigo-200"
        >
          <span className="text-lg">←</span>
          <span>Back to deposit</span>
        </button>

        <div className="text-xs text-gray-400">
          Secure on-chain deposits •{" "}
          <span className="text-indigo-300 font-medium">NexTrade Crypto FX</span>
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-[2fr,minmax(0,1.4fr)] gap-6">
        {/* Left: list & search */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-2xl shadow-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-blue-200">
                Deposit with Crypto
              </h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Choose a supported asset to receive deposits directly into your
                NexTrade wallet.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
              Deposits: <span className="text-white">Online</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex bg-black/40 rounded-full border border-white/10 p-1">
              <button
                onClick={() => setTab("Crypto")}
                className={`px-4 py-1.5 text-xs md:text-sm rounded-full transition ${
                  tab === "Crypto"
                    ? "bg-indigo-500 text-black font-medium"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Crypto
              </button>
              <button
                onClick={() => setTab("Fiat")}
                className={`px-4 py-1.5 text-xs md:text-sm rounded-full transition ${
                  tab === "Fiat"
                    ? "bg-indigo-500 text-black font-medium"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Fiat
              </button>
            </div>

            <div className="hidden md:block text-[11px] text-gray-500">
              Network fees apply • 1–2 confirmations
            </div>
          </div>

          {/* Search */}
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by symbol (e.g. BTC, USDT)"
                className="w-full px-3 py-2.5 pr-10 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-indigo-400 placeholder:text-gray-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ⌕
              </span>
            </div>
          </div>

          {/* Crypto list */}
          {tab === "Crypto" ? (
            <div className="mt-2 max-h-[55vh] overflow-y-auto custom-scroll space-y-1">
              {filtered.map((crypto) => {
                const supported = !!SUPPORTED[crypto.name];
                return (
                  <div
                    key={crypto.name}
                    onClick={() => handleClick(crypto)}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-indigo-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {crypto.logo ? (
                        <div className="w-9 h-9 rounded-full bg-black/70 flex items-center justify-center overflow-hidden border border-white/10">
                          <img
                            src={crypto.logo}
                            alt={crypto.name}
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs uppercase border border-white/10">
                          {crypto.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{crypto.name}</div>
                        <div className="text-[11px] text-gray-500">
                          {supported
                            ? "Available for on-chain deposit"
                            : "Coming soon"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          supported
                            ? "bg-green-500/15 text-green-300 border border-green-400/40"
                            : "bg-yellow-500/10 text-yellow-300 border border-yellow-400/40"
                        }`}
                      >
                        {supported ? "LIVE" : "SOON"}
                      </span>
                      <span className="hidden md:inline text-[11px] text-gray-500">
                        View details →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-400 text-sm">
              Fiat deposits will be available soon.
              <div className="mt-2 text-[11px] text-gray-500">
                Local bank rails and card payments are being integrated.
              </div>
            </div>
          )}
        </div>

        {/* Right: info / help panel */}
        <div className="space-y-4">
          <div className="bg-[#0b1224] rounded-2xl border border-white/10 p-4 shadow-lg">
            <div className="text-xs uppercase text-gray-500 mb-1">
              Deposit summary
            </div>
            <div className="text-sm text-gray-300 leading-relaxed">
              Crypto deposits are routed to your{" "}
              <span className="text-indigo-300 font-medium">
                main NexTrade wallet
              </span>
              . From there, you can move funds into your{" "}
              <span className="text-blue-300 font-medium">
                trading account
              </span>{" "}
              instantly.
            </div>
            <ul className="mt-3 space-y-1.5 text-[11px] text-gray-400">
              <li>• Minimum deposit per asset: dynamic per network</li>
              <li>• Make sure the network and asset match exactly</li>
              <li>• Unsupported networks may lead to permanent loss</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-purple-500/20 rounded-2xl border border-indigo-500/40 p-4 shadow-[0_0_40px_rgba(79,70,229,0.35)]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-blue-100">
                Pro tip
              </div>
              <span className="text-[11px] text-indigo-100/80 px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                Best experience
              </span>
            </div>
            <p className="text-[11px] text-indigo-100/80 leading-relaxed">
              Always send a small test amount first before large transfers.
              Once confirmed, you can safely fund larger positions into your
              NexTrade wallet.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <div className="bg-[#070b16] text-white rounded-2xl w-full max-w-md p-5 relative shadow-2xl border border-white/10 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] uppercase text-gray-500">
                  Deposit details
                </div>
                <div className="text-base font-semibold">
                  {selected.name} funding address
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-red-400 text-lg"
              >
                ✕
              </button>
            </div>

            {isSupported ? (
              <>
                <div className="flex items-center justify-between mb-3 text-[11px] text-gray-400">
                  <div>
                    Network:{" "}
                    <span className="text-white font-medium">
                      {selected.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span>Active</span>
                  </div>
                </div>

                {/* QR */}
                <div className="flex justify-center mb-4">
                  <div className="p-2 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                    <img
                      src={SUPPORTED[selected.name].qr}
                      alt={`${selected.name} QR`}
                      className="w-40 h-40 rounded-xl"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="bg-black/50 rounded-xl p-3 mb-4 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-400">
                      Wallet address
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-[11px] text-indigo-300 hover:text-indigo-100 flex items-center gap-1"
                    >
                      Copy
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 4h13v16H8V4zm-2 4H4v12h2V8zm4-4v2h5V4h-5z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs break-all text-gray-100">
                    {SUPPORTED[selected.name].address}
                  </div>
                  {copied && (
                    <p className="text-green-400 text-[11px] mt-1">
                      Address copied to clipboard.
                    </p>
                  )}
                </div>

                {/* Info rows */}
                <div className="text-[11px] space-y-1.5 mb-4 text-gray-300">
                  <p>
                    Minimum deposit amount{" "}
                    <span className="float-right text-white">
                      0.000006 {selected.name}
                    </span>
                  </p>
                  <p>
                    Route deposits to{" "}
                    <span className="float-right text-white">
                      Main NexTrade wallet
                    </span>
                  </p>
                  <p>
                    First credit{" "}
                    <span className="float-right text-white">
                      1 blockchain confirmation
                    </span>
                  </p>
                  <p>
                    Withdrawal unlocked{" "}
                    <span className="float-right text-white">
                      2 confirmations
                    </span>
                  </p>
                </div>

                {/* Warning */}
                <div className="text-[11px] text-gray-300 bg-black/60 p-3 rounded-xl mb-4 border border-red-500/30">
                  <p>
                    Send only{" "}
                    <span className="font-semibold text-white">
                      {selected.name}
                    </span>{" "}
                    to this address. Deposits of any other asset or from
                    unsupported networks may be permanently lost and cannot be
                    recovered.
                  </p>
                  <p className="mt-2 text-red-300">
                    BEP2 and BEP20 (BSC) deposits are not supported.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button className="w-1/2 py-2.5 bg-white/5 rounded-xl text-xs hover:bg-white/10 border border-white/10">
                    Save QR
                  </button>
                  <button
                    onClick={handleCopy}
                    className="w-1/2 py-2.5 bg-indigo-500 rounded-xl text-xs text-black font-semibold hover:bg-indigo-400"
                  >
                    Copy address
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6 text-center text-sm text-red-300">
                {selected.name} is not available for deposit yet.
                <p className="mt-2 text-[11px] text-gray-400">
                  We&apos;re onboarding more networks gradually. Check back
                  later or choose a supported asset like BTC, ETH, USDT, BNB, or
                  SOL.
                </p>
              </div>
            )}
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              0% {
                opacity: 0;
                transform: scale(0.94) translateY(6px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
