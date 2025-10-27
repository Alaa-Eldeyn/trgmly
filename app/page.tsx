"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#f9fafb] text-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-6xl font-semibold text-[#1f2937] mb-4"
      >
        Trgmly
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-xl text-[#4b5563] mb-10"
      >
        خلي الكود بتاعك يتكلم كل اللغات 🌍
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-8 py-3 bg-[#1f2937] text-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
      >
         انتظرونا قريبًا 
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-sm text-[#9ca3af] mt-10"
      >
        © {new Date().getFullYear()} Trgmly. All rights reserved.
      </motion.p>
    </main>
  );
}
