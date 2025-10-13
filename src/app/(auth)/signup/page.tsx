"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebookF } from "react-icons/fa";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md bg-[#1b222d] rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md bg-[#232b36] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-[#232b36] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-[#232b36] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all"
          >
            Sign Up
          </button>
        </form>

        <div className="my-6 text-center text-sm text-gray-400">or sign up with</div>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => signIn("github", { callbackUrl: "/" })} className="flex items-center justify-center gap-2 py-2 bg-[#232b36] rounded-md hover:bg-[#2a3240] transition">
            <FaGithub className="text-xl" />
          </button>
          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="flex items-center justify-center gap-2 py-2 bg-[#232b36] rounded-md hover:bg-[#2a3240] transition">
            <FcGoogle className="text-xl" />
          </button>
          <button onClick={() => signIn("facebook", { callbackUrl: "/" })} className="flex items-center justify-center gap-2 py-2 bg-[#232b36] rounded-md hover:bg-[#2a3240] transition">
            <FaFacebookF className="text-blue-500 text-xl" />
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
