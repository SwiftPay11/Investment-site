"use client";

import { useEffect, useState } from "react";

export default function AdminGiftcardsPage() {
  const [loading, setLoading] = useState(true);
  const [giftcards, setGiftcards] = useState([]);
  const [error, setError] = useState("");

  const API = "https://investment-site-x6tr.onrender.com"; // CHANGE TO RENDER URL ON DEPLOY

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/wallet/giftcards/pending`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to load data");

      setGiftcards(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const takeAction = async (id, action) => {
    try {
      const res = await fetch(`https://investment-site-x6tr.onrender.com/wallet/giftcards/${action}/${id}`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action}`);

      alert(`Giftcard ${action} successful`);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        Pending Giftcard Deposits
      </h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : giftcards.length === 0 ? (
        <p className="text-gray-400">No pending giftcard deposits.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftcards.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#131a33] border border-white/10 rounded-2xl p-4 shadow-lg"
            >
              <div className="mb-3">
                <p className="text-xs text-gray-400">User</p>
                <p className="font-medium text-blue-300">{tx.user.email}</p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-400">Card Type</p>
                <p className="font-medium">{tx.metadata.cardType}</p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-400">Amount</p>
                <p className="text-lg font-semibold text-green-400">
                  ${tx.amount}
                </p>
              </div>

              {tx.metadata.note && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400">Note</p>
                  <p className="text-sm text-gray-300">{tx.metadata.note}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Image</p>
                <img
                  src={tx.metadata.image}
                  alt="Giftcard"
                  className="w-full h-40 object-cover rounded-lg border border-white/10 shadow"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => takeAction(tx.id, "approve")}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => takeAction(tx.id, "reject")}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-400 text-black font-semibold rounded-lg text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
