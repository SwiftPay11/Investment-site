"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("https://investment-site-x6tr.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    const sessionUser = data.user ?? data.data?.user ?? {
      email,
      name: data.name ?? email.split("@")[0],
      ...(data.userId ? { id: data.userId } : {}),
    };
    const sessionToken = data.token ?? data.data?.token;

    if (sessionToken) {
      localStorage.setItem("token", sessionToken);
    } else {
      localStorage.removeItem("token");
    }

    localStorage.setItem("user", JSON.stringify(sessionUser));

    if (sessionUser.id) {
      localStorage.setItem("userId", sessionUser.id);
    } else {
      localStorage.removeItem("userId");
    }

    localStorage.removeItem("pendingEmail");
    router.replace("/dashboard");
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-5 bg-transparent">
        <h1 className="text-3xl font-bold text-blue-400">NexTrade</h1>
        <div className="flex items-center gap-4">
          <select className="bg-transparent border border-gray-500 rounded-md p-2 text-sm">
            <option>English</option>
            <option>Français</option>
            <option>Deutsch</option>
          </select>
          <button
            onClick={() => router.push("/register")}
            className="border border-blue-400 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition"
          >
            Register a Profile
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#0b122a] rounded-2xl shadow-xl p-10 w-full max-w-md border border-blue-900/40">
          <h2 className="text-2xl font-semibold text-center mb-8 text-blue-300">
            Log in to Your Profile
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#0f1738] border border-blue-800 rounded-md focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#0f1738] border border-blue-800 rounded-md focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Remember me
              </label>
              <a href="/reset" className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Not our client yet?{" "}
              <a
                href="/register"
                className="text-blue-400 hover:underline font-semibold"
              >
                Register a Profile
              </a>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t border-blue-900/40">
        © {new Date().getFullYear()} NexTrade Markets. All rights reserved.
      </footer>
    </div>
  );
}
