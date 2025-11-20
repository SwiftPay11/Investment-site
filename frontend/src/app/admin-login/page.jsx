"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch(`https://investment-site-x6tr.onrender.com/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Invalid admin credentials");
      return;
    }

    const data = await res.json();

    // Store admin session
    sessionStorage.setItem("isAdmin", "true");

    router.push("/admin-dashboard");
  } catch (err) {
    setError("Server error. Try again.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d243a] text-white">
      <h1 className="text-2xl font-bold mb-6">NexTrade Admin Login</h1>
      <form onSubmit={handleLogin} className="w-80 bg-[#142c4b] p-6 rounded-lg shadow-md">
        <label className="block mb-3">
          <span>Email</span>
          <input
            type="email"
            className="w-full p-2 rounded mt-1 bg-gray-800 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span>Password</span>
          <input
            type="password"
            className="w-full p-2 rounded mt-1 bg-gray-800 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
