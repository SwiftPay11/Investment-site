"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false); // ⭐ NEW

  useEffect(() => {
    const saved = localStorage.getItem("pendingEmail");
    if (!saved) router.push("/auth");
    setEmail(saved || "");
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code) return alert("Enter your 6-digit code");

    setLoading(true);

    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/verify-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // SUCCESS → Show success screen first
      setSuccess(true);
      setLoading(false);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.id);

      localStorage.removeItem("pendingEmail");

      // Redirect with delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  // -------------------------
  // SUCCESS SCREEN
  // -------------------------
  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white px-6">
        <div className="bg-[#0b122a] p-10 rounded-2xl shadow-xl w-full max-w-md border border-blue-900/40 text-center">
          <h2 className="text-2xl font-semibold text-green-300 mb-4">
            Login Successful
          </h2>
          <p className="text-gray-300 mb-6">Redirecting to your dashboard...</p>

          {/* Beautiful Loading Spinner */}
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // NORMAL PAGE
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white flex flex-col">
      <header className="flex justify-between items-center px-10 py-5 bg-transparent">
        <h1 className="text-3xl font-bold text-blue-400">CryptoFX</h1>
      </header>

      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#0b122a] rounded-2xl shadow-xl p-10 w-full max-w-md border border-blue-900/40">
          <h2 className="text-2xl font-semibold text-center mb-8 text-blue-300">
            Enter Login Verification Code
          </h2>

          <p className="text-green-400 text-center mb-6 text-sm">
            A 6-digit code was sent to <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 bg-[#0f1738] border border-blue-800 rounded-md focus:border-blue-500 outline-none text-center tracking-widest text-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-400 hover:underline text-sm text-center block mx-auto mt-4"
            >
              Back to Login
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-4 border-t border-blue-900/40">
        © {new Date().getFullYear()} CryptoFX Markets. All rights reserved.
      </footer>
    </div>
  );
}
