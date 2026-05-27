"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid password");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-2">
            Admin Access
          </h1>
          <p className="text-[#888888] text-sm">
            Enter password to view messages
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-[#555555] text-sm focus:border-[#ef745c]/50 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl border border-white/20 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? "Verifying..." : "Enter"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors"
          >
            Back to Portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
