"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaBolt, FaWallet, FaHeadset } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CredentialsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const fullName = `${form.firstName} ${form.lastName}`;

  const payload = {
    fullName,
    dob: form.dob,
    phone: form.phone,
    // add gender + country if you later collect them
  };

  try {
    const res = await fetch("https://investment-site-x6tr.onrender.com/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const updatedUser = await res.json();

    localStorage.setItem("user", JSON.stringify(updatedUser));

    router.push("/dashboard");
  } catch (err) {
    alert("Something went wrong!");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2c] to-[#08142b] text-white flex flex-col md:flex-row items-center justify-center p-4">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="md:w-1/2 w-full flex flex-col items-start justify-center p-8 space-y-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
          Complete Your Profile
        </h1>
        <p className="text-gray-400 max-w-md">
          We need a few more details to complete your NexTrade account setup.
          Your data is encrypted and used only for verification.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center space-x-3 bg-[#0f1a40]/60 rounded-xl p-3">
            <FaBolt className="text-indigo-400 text-xl" />
            <span className="text-sm font-medium">Ultra-fast Execution</span>
          </div>
          <div className="flex items-center space-x-3 bg-[#0f1a40]/60 rounded-xl p-3">
            <FaWallet className="text-blue-400 text-xl" />
            <span className="text-sm font-medium">Funding Fees 0%</span>
          </div>
          <div className="flex items-center space-x-3 bg-[#0f1a40]/60 rounded-xl p-3">
            <FaHeadset className="text-indigo-300 text-xl" />
            <span className="text-sm font-medium">Support 24/5</span>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="md:w-1/2 w-full max-w-md bg-[#0d1333]/80 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Personal Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full bg-[#101942] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full bg-[#101942] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full bg-[#101942] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mobile Number</label>
            <PhoneInput
              country={"us"}
              value={form.phone}
              onChange={(phone) => setForm({ ...form, phone })}
              inputClass="!bg-[#101942] !text-white !border !border-gray-700 !rounded-lg !w-full"
              buttonClass="!bg-[#101942] !border-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 transition-all py-2 rounded-xl font-semibold text-white shadow-md"
          >
            Save and Continue
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Your information is encrypted and protected under strict verification
          policies.
        </p>
      </motion.div>
    </div>
  );
}
