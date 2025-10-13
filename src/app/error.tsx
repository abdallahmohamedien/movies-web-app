"use client";

import { useEffect } from "react";
import { RefreshCw, Zap } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application Error Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-900 text-white p-6">
      <Zap className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-4xl font-bold text-red-400 mb-3">
        Something Went Wrong!
      </h2>
      <p className="text-gray-400 text-lg mb-6 text-center max-w-lg">
        Sorry, we encountered an unexpected issue. Please try reloading the
        content.
      </p>

      <p className="text-sm text-gray-500 mb-8">
        Error Details: {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium leading-5 shadow-lg text-gray-900 transition-colors duration-150 bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:shadow-outline-yellow"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
