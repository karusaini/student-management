"use client";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 sm:px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-xl bg-white p-12 rounded-3xl shadow-2xl border border-gray-200"
      >
        <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-black mb-8 leading-tight">
          Welcome to <span className="text-black">Student Management</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed">
          Manage your student records effortlessly. Please log in to access the
          dashboard and manage your student data securely.
        </p>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white px-10 py-4 rounded-full shadow-lg transform transition-all hover:bg-blue-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 font-medium text-lg"
        >
          Login
        </motion.button>
      </motion.div>
    </div>
  );
}
