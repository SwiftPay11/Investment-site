"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-md fixed top-0 w-full z-50">
        <h1 className="text-2xl font-bold text-blue-400 tracking-wider">NexTrade</h1>
        <div className="hidden md:flex space-x-6 text-sm">
          <a href="#" className="hover:text-blue-400 transition">Home</a>
          <a href="#" className="hover:text-blue-400 transition">Markets</a>
          <a href="#" className="hover:text-blue-400 transition">About</a>
          <a href="#" className="hover:text-blue-400 transition">Contact</a>
        </div>
        <button className="px-5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition text-sm"
        onClick={() => router.push("/login")}>
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col justify-center items-center text-center flex-grow px-4 pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-blue-100"
        >
          Trade Smarter with <span className="text-blue-500">NexTrade</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-gray-400 text-lg max-w-2xl"
        >
          Start investing and trading digital assets confidently with a trusted
          platform built for performance and security.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-blue-400/40 transition-all"
         onClick={() => router.push("/login")}>
          Start Trading
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} CryptoFX. All rights reserved.
      </footer>
    </div>
  );
}
