"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCamera } from "react-icons/fi";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(saved);
    setUser(parsed);
    setPreview(parsed?.profilePic || null);
  }, []);

  // Upload profile picture locally
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setPreview(imageURL);

    // Save to localStorage (you can later change to backend upload)
    const updatedUser = { ...user, profilePic: imageURL };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (!user) return null;

  const firstName = user.fullName?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white p-5">
      
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-3 text-gray-300">
          ←
        </button>
        <h1 className="text-xl font-semibold">My Profile</h1>
      </div>

      {/* PROFILE SECTION */}
      <div className="flex flex-col items-center mb-8">

        {/* Profile Picture Circle */}
        <label className="relative cursor-pointer">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border border-gray-700"
          />

          {/* Camera Icon */}
          <div className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full">
            <FiCamera />
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* First Name */}
        <p className="text-xl font-semibold mt-4">{fullname}</p>

        {/* Email */}
        <p className="text-gray-400 text-sm">{user.email}</p>
      </div>

      {/* USER INFORMATION SECTION */}
      <div className="bg-[#141726] rounded-xl border border-[#1e2237] p-5 mb-8">
        <InfoRow label="User ID" value={user.id || "N/A"} />
        <InfoRow label="Mobile Number" value={user.phone || "N/A"} />
        <InfoRow label="Gender" value={user.gender || "N/A"} />
        <InfoRow label="Date of Birth" value={user.dob || "N/A"} />
        <InfoRow label="Full Name" value={user.fullname || "N/A"} last />
      </div>

      {/* ACCOUNT TIER SECTION */}
      <div className="bg-[#141726] rounded-xl border border-[#1e2237] p-5 mb-8">
        <p className="text-gray-400 text-sm">Account Tier</p>
        <p className="text-lg font-medium mt-1">
          {user.tier || "Tier 1"}
        </p>
      </div>

    </div>
  );
}

/* Reusable Row Component */
function InfoRow({ label, value, last }) {
  return (
    <div className={`py-3 ${!last ? "border-b border-[#1e2237]" : ""}`}>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-base mt-1">{value}</p>
    </div>
  );
}
