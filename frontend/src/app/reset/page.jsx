"use client";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Toast notification
  const [toast, setToast] = useState({ show: false, type: "", msg: "" });

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false, type: "", msg: "" }), 3000);
  };

  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Request Reset Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.87:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message);
      } else {
        showToast("success", data.message);
        setStep(2);
      }
    } catch {
      showToast("error", "Network error. Try again.");
    }
    setLoading(false);
  };

  // Step 2: Confirm Reset
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/confirm-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          code: form.code,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message);
      } else {
        showToast("success", data.message + " You can now log in.");
        setStep(3);
      }
    } catch {
      showToast("error", "Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020817] via-[#031428] to-[#051e3a] px-4">
      
      {/* TOAST MESSAGE */}
      {toast.show && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* FORM CARD */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">
          {step === 1
            ? "Reset Your Password"
            : step === 2
            ? "Enter Reset Code"
            : "Password Reset Successful"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                placeholder="Enter your registered email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition rounded-lg font-semibold shadow-md"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirmReset} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                Reset Code
              </label>
              <input
                type="text"
                name="code"
                required
                value={form.code}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                placeholder="Enter 6-digit code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                required
                value={form.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                placeholder="Enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition rounded-lg font-semibold shadow-md"
            >
              {loading ? "Resetting..." : "Confirm Reset"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-5">
            <div className="text-green-400 text-xl font-medium">
              Your password has been changed successfully!
            </div>

            <a
              href="/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Back to Login
            </a>
          </div>
        )}
      </div>

      {/* Tailwind animation */}
      <style>{`
        .animate-fade {
          animation: fadein 0.4s ease, fadeout 0.4s ease 2.6s forwards;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeout {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
