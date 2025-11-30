"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Icons
import { 
  FiUser, 
  FiLock, 
  FiKey, 
  FiHome, 
  FiShield, 
  FiMessageCircle, 
  FiClipboard, 
  FiSun, 
  FiPower 
} from "react-icons/fi";

export default function SettingsPage() {
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

  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white p-5 flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-3 text-gray-300">
          ←
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* GROUP 1 */}
      <div className="bg-[#141726] rounded-xl border border-[#1e2237] mb-6">
         <div className="cursor-pointer hover:bg-white/10 transition" onClick={() => router.push("settings/profile")}>
        <SettingItem icon={<FiUser />} label="My Profile"/>
        </div>
        <SettingItem icon={<FiLock />} label="Payment Settings" />
        <SettingItem icon={<FiKey />} label="Login Settings" />
        <SettingItem icon={<FiHome />} label="Saving Settings" last />
      </div>

      {/* GROUP 2 */}
      <div className="bg-[#141726] rounded-xl border border-[#1e2237] mb-6">
        <SettingItem icon={<FiHome />} label="Homepage Settings" />
        <SettingItem 
          icon={<FiShield />} 
          label="Security Questions" 
          extra={<span className="text-blue-400 text-sm">Reset</span>} 
        />
        <SettingItem icon={<FiMessageCircle />} label="SMS Alert Settings" />
        <SettingItem icon={<FiClipboard />} label="Access to Clipboard" />
        <SettingItem icon={<FiSun />} label="Themes" last />
      </div>

      {/* GROUP 3 */}
      <div className="bg-[#141726] rounded-xl border border-[#1e2237] mb-6">
        <SettingItem icon={<FiShield />} label="Security Center" />
        <SettingItem icon={<FiMessageCircle />} label="Feedback and Suggestions" last />
      </div>

      {/* Close Account */}
      <div className="bg-[#141726] rounded-xl border border-[#1e2237] mb-6">
        <SettingItem icon={<FiPower />} label="Close Account" last />
      </div>

      {/* SIGN OUT BUTTON */}
      <button
        onClick={handleSignOut}
        className="w-full bg-blue-600 mt-auto py-3 rounded-xl font-semibold text-white shadow-lg shadow-red-900/40"
      >
        Sign Out
      </button>
    </div>
  );
}

/* Reusable Setting Row Component */
function SettingItem({ icon, label, extra, last }) {
  return (
    <div
      className={`flex items-center justify-between p-4 ${
        !last ? "border-b border-[#1e2237]" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-400 text-xl">{icon}</div>
        <p className="text-base">{label}</p>
      </div>

      <div className="flex items-center gap-2">
        {extra}
        <span className="text-gray-400">›</span>
      </div>
    </div>
  );
}
