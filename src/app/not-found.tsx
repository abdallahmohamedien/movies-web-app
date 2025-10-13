import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-9xl font-extrabold text-yellow-500 tracking-widest">
        404
      </h1>
      <div className="bg-gray-800 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <p className="mt-5 text-xl text-gray-400">
        Sorry, the page you&apos;re looking for does not exist. It might have been
        removed or you mistyped the address.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium leading-5 shadow-lg text-gray-900 transition-colors duration-150 bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:shadow-outline-yellow"
      >
        <Home className="w-5 h-5" />
        <span>Go to Homepage</span>
      </Link>
    </div>
  );
}
