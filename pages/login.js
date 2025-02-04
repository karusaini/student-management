"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase"; // Firebase initialization file
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth listener
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is already logged in, redirect to students page
        router.push("/students");
      }
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/students"); // Redirect to students page after successful login
    } catch (error) {
      // Handle error (e.g., invalid credentials)
      setError("Invalid email or password!");
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        onSubmit={handleLogin}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Login
        </h2>
        {error && <p className="text-red-600 text-center mb-6">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-black font-lg mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="block w-full p-4 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-black font-lg mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="block w-full p-4 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-blue-600 text-white px-6 py-4 rounded-xl w-full shadow-lg transform transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 font-semibold text-lg"
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
}
