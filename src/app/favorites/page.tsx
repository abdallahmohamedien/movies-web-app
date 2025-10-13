"use client";

import { useFavorites } from "@/providers/FavoritesContext";
import { useEffect, useState, useMemo } from "react";
import MovieCard from "@/components/MovieCard";
import PaginationControls from "@/components/PaginationControls";
import { Loader2 } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
};

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="w-full h-60 bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-600 rounded w-3/4" />
        <div className="h-3 bg-gray-600 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { favoriteIds, isLoaded } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (!isLoaded) return;

    if (favoriteIds.length === 0) {
      setFavoriteMovies([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    async function fetchFavorites() {
      try {
        const results = await Promise.all(
          favoriteIds.map((id) =>
            fetch(`/api/movies/${id}`).then((res) => res.json())
          )
        );
        setFavoriteMovies(results);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setFavoriteMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavorites();
  }, [favoriteIds, isLoaded]);

  const totalPages = Math.ceil(favoriteMovies.length / ITEMS_PER_PAGE);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return favoriteMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [favoriteMovies, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isLoaded)
    return (
      <main className="min-h-screen p-8 bg-gray-900 text-white flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </main>
    );

  if (isLoading)
    return (
      <main className="min-h-screen p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-extrabold mb-6 text-yellow-500 border-b-2 border-yellow-700 pb-2">
          Your Favorite Movies
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );

  if (favoriteMovies.length === 0)
    return (
      <div className="text-center text-xl p-10 text-white">
        You don’t have any favorite movies yet. Click the heart icon to add one!
      </div>
    );

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-extrabold mb-6 text-yellow-500 border-b-2 border-yellow-700 pb-2">
        Your Favorite Movies
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {paginatedMovies.map((movie, index) => (
          <MovieCard key={movie?.id ?? index} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/favorites"
          onPageChange={handlePageChange}
          isClientSide
        />
      )}
    </main>
  );
}
