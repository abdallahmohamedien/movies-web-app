"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, Film, Laugh, Heart, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const genreLinks = [
  { name: "Action", id: 28, icon: Film },
  { name: "Comedy", id: 35, icon: Laugh },
  { name: "Romantic", id: 10749, icon: Heart },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Welcome Message Logic (fixed)
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const lastUser = localStorage.getItem("lastUser");
      if (lastUser !== session.user.email) {
        setShowWelcome(true);
        localStorage.setItem("lastUser", session.user.email || "");
      }
    }
  }, [status, session]);


  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/signin" || pathname === "/signup") return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setIsLoading(true);
      router.replace(`/?search=${encodeURIComponent(search.trim())}`);
      setIsLoading(false);
    } else {
      router.push(`/`);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-gray-900 sticky top-0 z-50 shadow-xl">

      {showWelcome && session?.user && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl shadow-lg animate-slide-down md:w-auto w-11/12 text-center font-medium transition-all duration-500">
          🎉 Welcome aboard,{" "}
          <span className="font-bold">{session.user.name}</span>! Enjoy
          exploring movies 🍿
        </div>
      )}

      <div className="container mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            🎬 Movie Explorer
          </Link>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-yellow-400"
          >
            {mobileMenu ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex w-full md:w-auto min-w-[200px] md:flex-1"
        >
          <input
            type="text"
            autoComplete="off"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 text-base rounded-l-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-yellow-500 w-full"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center bg-yellow-500 text-gray-900 px-4 py-3 rounded-r-lg font-semibold transition hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="hidden sm:inline ml-1">Search</span>
          </button>
        </form>

        <div className="hidden md:flex items-center gap-3 relative">
          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 cursor-pointer focus:outline-none border-2 border-yellow-500 hover:scale-105 transition-transform"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User"
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  session.user.name?.[0].toUpperCase()
                )}
              </button>

              {dropdownOpen && (
                <>

                  <div className="fixed inset-0 z-40" />

                  <div className="absolute right-0 mt-3 w-56 bg-gray-800 rounded-xl shadow-lg animate-fade-in z-50 overflow-hidden border border-gray-700">
                    <div className="p-4 border-b border-gray-700 text-center">
                      <p className="text-sm text-gray-200">
                        Hello,{" "}
                        <span className="font-semibold">
                          {session.user.name}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Ready to explore new movies? 🎬
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/signin" })}
                      className="w-full text-left px-5 py-3 text-red-500 hover:bg-gray-700 transition font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-600 transition shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>


      {mobileMenu && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 flex flex-col gap-3 animate-slide-down border-t border-gray-700">
          {session?.user ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold">
                    {session.user.name?.[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-200 font-semibold">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {session.user.email?.split("@")[0]}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="w-full text-center bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold border border-gray-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
      <nav className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto py-2 text-white text-sm md:text-base relative">
          <ul className="flex w-full justify-around relative">
            {session?.user && (
              <li className="flex-1 text-center relative">
                <Link
                  href="/favorites"
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive("/favorites")
                      ? "text-red-500 font-bold"
                      : "hover:text-red-500"
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto" fill="currentColor" />
                  <span className="text-sm">Favorites</span>
                </Link>
                {isActive("/favorites") && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-full animate-slide-in" />
                )}
              </li>
            )}

            {genreLinks.map((genre) => (
              <li key={genre.id} className="flex-1 text-center relative">
                <Link
                  href={`/genre/${genre.id}`}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive(`/genre/${genre.id}`)
                      ? "text-yellow-400 font-semibold"
                      : "hover:text-yellow-400"
                  }`}
                >
                  <genre.icon className="w-5 h-5 mx-auto" />
                  <span className="text-sm">{genre.name}</span>
                </Link>
                {isActive(`/genre/${genre.id}`) && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full animate-slide-in" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
