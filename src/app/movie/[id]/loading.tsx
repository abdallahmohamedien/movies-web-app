import { Loader2 } from "lucide-react";

export default function DetailsLoading() {
  return (
    <main>
      <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10 bg-gray-900 rounded-xl shadow-2xl animate-pulse">
        <div className="flex-shrink-0 w-full md:w-1/3 max-w-sm mx-auto md:mx-0">
          <div className="w-full h-[450px] bg-gray-700 rounded-lg shadow-xl"></div>
        </div>

        <div className="flex-grow text-white">
          <div className="h-10 bg-gray-700 rounded w-4/5 mb-3"></div>

          <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>

          <div className="h-5 bg-gray-700 rounded w-1/3 mt-8 mb-4"></div>

          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mt-8">
            <div className="h-4 bg-gray-700 rounded w-3/5"></div>
            <div className="h-4 bg-gray-700 rounded w-3/5"></div>
            <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            <div className="h-4 bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    </main>
  );
}
