"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
interface AuthUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function AuthButtons({ user }: { user?: AuthUser }) {
  if (user) {
    return (
      <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || "User Avatar"}
            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500"
          />
        )}
        <span className="text-lg text-white">
          Welcome, {user.name || user.email}!
        </span>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300 shadow-md"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-8">
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition duration-300 shadow-xl"
      >
        Sign In 
      </button>
    </div>
  );
}
