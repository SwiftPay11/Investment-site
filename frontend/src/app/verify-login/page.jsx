"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const hasSession = Boolean(localStorage.getItem("user"));
    localStorage.removeItem("pendingEmail");
    router.replace(hasSession ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white">
      <div className="flex items-center gap-3 text-sm text-blue-200">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        Redirectting…
      </div>
    </div>
  );
}
