"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, Film, Laugh, Heart } from "lucide-react";
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
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (session?.user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [session]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl shadow-lg animate-slide-down md:w-auto w-11/12 text-center">
          Welcome back, <span className="font-bold">{session.user.name}</span>! 🎬
        </div>
      )}

      <div className="container mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative">
        {/* Logo + Mobile dropdown button */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            🎬 Movie Explorer
          </Link>

          {session?.user && (
            <div className="md:hidden relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 cursor-pointer focus:outline-none"
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
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg animate-slide-down z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-700 text-center">
                    <p className="text-sm text-gray-200">
                      Hello, <span className="font-semibold">{session.user.name}</span>!
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Ready to explore movies? 🎬
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 transition font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
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
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline ml-1">Search</span>
          </button>
        </form>

        <div className="hidden md:flex items-center gap-3 relative">
          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 cursor-pointer focus:outline-none"
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
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg animate-slide-down z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm text-gray-200">
                      Hello, <span className="font-semibold">{session.user.name}</span>!
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Ready to explore new movies? 🎬
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 transition font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
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


      <nav className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto py-2 text-white text-sm md:text-base relative">
          <ul className="flex w-full justify-around relative">
            {session?.user && (
              <li className="flex-1 text-center relative">
                <Link
                  href="/favorites"
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive("/favorites") ? "text-red-500 font-bold" : "hover:text-red-500"
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
                    isActive(`/genre/${genre.id}`) ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
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
