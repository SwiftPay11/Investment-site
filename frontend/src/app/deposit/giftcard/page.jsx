"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CARD_TYPES = [
  { id: "amazon", label: "Amazon", hint: "USD / EUR cards accepted" },
  { id: "apple", label: "Apple", hint: "App Store & iTunes" },
  { id: "steam", label: "Steam", hint: "Gaming giftcards" },
  { id: "google", label: "Google Play", hint: "Digital only" },
  { id: "walmart", label: "Walmart", hint: "Physical & eCodes" },
];

export default function DepositGiftcardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [cardType, setCardType] = useState("amazon");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("User not found. Please log in again.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!file) {
      setError("Please upload a clear image of the giftcard.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("userId", String(user.id));
      formData.append("amount", String(amount));
      formData.append("cardType", cardType);
      if (note) formData.append("note", note);
      formData.append("file", file);

      const res = await fetch(
        "https://investment-site-x6tr.onrender.com/wallet/deposit-giftcard",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || "Failed to submit giftcard deposit."
        );
      }

      setSuccessMsg("Giftcard submitted successfully. We will review and credit your wallet.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#050a1a] to-[#050816] text-white px-4 py-6">
      {/* Top bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="text-indigo-400 flex items-center gap-1 text-sm hover:text-indigo-200"
        >
          <span className="text-lg">←</span>
          <span>Back to deposit</span>
        </button>

        <div className="text-xs text-gray-400">
          Giftcard deposits •{" "}
          <span className="text-indigo-300 font-medium">
            Manual review required
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-[1.4fr,minmax(0,1.2fr)] gap-6">
        {/* Left: form */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-2xl shadow-xl p-5">
          <h1 className="text-xl md:text-2xl font-semibold text-blue-200 mb-1">
            Deposit with Giftcard
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mb-4">
            Upload a clear image of your giftcard and enter the face value.
            Once verified, the equivalent amount will be credited to your
            NexTrade wallet.
          </p>

          {/* Card types */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Select giftcard type</div>
            <div className="flex flex-wrap gap-2">
              {CARD_TYPES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCardType(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    cardType === c.id
                      ? "bg-indigo-500 text-black border-indigo-400"
                      : "bg-black/40 text-gray-300 border-white/10 hover:border-indigo-400/60"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {CARD_TYPES.find((c) => c.id === cardType)?.hint}
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">
              Card face value (USD)
            </label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-indigo-400 placeholder:text-gray-500"
              placeholder="e.g. 100"
            />
          </div>

          {/* Note */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">
              Note (optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-indigo-400 placeholder:text-gray-500 resize-none"
              placeholder="Extra info (currency, region, etc.)"
            />
          </div>

          {/* Upload area */}
          <div
            onDrop={handleDrop}
            onDragOver={preventDefaults}
            onDragEnter={preventDefaults}
            onDragLeave={preventDefaults}
            className="mb-4 rounded-2xl border border-dashed border-indigo-500/50 bg-black/30 p-4 flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="flex-1">
              <div className="text-xs text-gray-300 mb-1">
                Upload card image / code
              </div>
              <p className="text-[11px] text-gray-500">
                Upload a clear photo or screenshot showing the{" "}
                <span className="text-gray-200">full card code</span> and value.
              </p>
              <label className="inline-flex items-center mt-3 px-3 py-1.5 rounded-full bg-indigo-500 text-black text-xs font-semibold cursor-pointer hover:bg-indigo-400">
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-1 text-[11px] text-gray-500">
                PNG / JPG • max ~5MB (recommended)
              </p>
            </div>

            <div className="w-32 h-20 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-[11px] text-gray-500 overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Giftcard preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>Preview</span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-3 text-[11px] text-red-300 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-3 text-[11px] text-green-300 bg-green-500/10 border border-green-500/40 rounded-md px-3 py-2">
              {successMsg}
            </div>
          )}

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className={`mt-1 w-full py-2.5 rounded-xl text-sm font-semibold ${
              submitting
                ? "bg-blue-500/40 text-black cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-black hover:opacity-90"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Giftcard Deposit"}
          </button>
        </div>

        {/* Right: info block */}
        <div className="space-y-4">
          <div className="bg-[#0b1224] rounded-2xl border border-white/10 p-4 shadow-lg">
            <div className="text-xs uppercase text-gray-500 mb-1">
              How it works
            </div>
            <ol className="text-[11px] text-gray-300 space-y-1.5">
              <li>1. Select your giftcard type and enter the card value.</li>
              <li>2. Upload a clear image/screenshot of the card or eCode.</li>
              <li>
                3. Our team verifies the card and credits your{" "}
                <span className="text-indigo-300 font-medium">
                  NexTrade wallet
                </span>
                .
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-purple-500/20 rounded-2xl border border-indigo-500/40 p-4 shadow-[0_0_40px_rgba(79,70,229,0.35)]">
            <div className="text-sm font-semibold text-blue-100 mb-1">
              Important
            </div>
            <p className="text-[11px] text-indigo-100/80 leading-relaxed">
              Only trade giftcards you obtained legally. Damaged, used, region-
              locked or low-quality cards may be rejected. Always ensure the
              code is readable in the uploaded image.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
