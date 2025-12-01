"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountTierPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(saved));
  }, []);

  if (!user) return null;

  const currentTier = user.tier || "Tier 1";

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white p-5">
      
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-3 text-gray-300">
          ←
        </button>
        <h1 className="text-xl font-semibold">Account Tier</h1>
      </div>

      <p className="text-gray-400 text-sm mb-5">
        Your verification level determines your limits and access.
      </p>

      {/* CURRENT TIER */}
      <div className="bg-[#141726] rounded-xl border border-[#1e2237] p-5 mb-6">
        <p className="text-gray-400 text-sm">Current Tier</p>
        <p className="text-2xl font-semibold mt-1">{currentTier}</p>
      </div>

      {/* TIER CARDS */}
      <TierCard
        title="Tier 1 – Basic"
        description="Basic access with limited transaction volume."
        requirements={[
          "Email verification",
          "Basic profile information",
        ]}
        unlocked={true}
      />

      <TierCard
        title="Tier 2 – Advanced"
        description="Higher limits and more features."
        requirements={[
          "Government-issued ID upload",
          "Face verification",
          "Complete address information",
        ]}
        unlocked={false}
      />

      <TierCard
        title="Tier 3 – Unlimited"
        description="Full access with highest transaction limits."
        requirements={[
          "Proof of income",
          "Source of funds declaration",
          "Manual compliance approval",
        ]}
        unlocked={false}
      />

    </div>
  );
}

/* Tier Card Component */
function TierCard({ title, description, requirements, unlocked }) {
  return (
    <div className="bg-[#141726] rounded-xl border border-[#1e2237] p-5 mb-6">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-gray-400 text-sm mt-1 mb-4">{description}</p>

      <ul className="mb-4">
        {requirements.map((req, i) => (
          <li key={i} className="text-gray-300 text-sm flex items-start mb-2">
            <span className="text-green-400 mr-2">•</span> {req}
          </li>
        ))}
      </ul>

      {unlocked ? (
        <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold">
          Completed ✓
        </button>
      ) : (
        <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          Start Verification
        </button>
      )}
    </div>
  );
}
