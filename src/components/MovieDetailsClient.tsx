"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IMAGE_PATH } from "@/services/tmdb";
import { useFavorites } from "@/providers/FavoritesContext";

interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  vote_average: number;
  runtime: number;
  genres: { name: string }[];
  poster_path: string | null;
}

export default function MovieDetailsClient({ movie }: { movie: MovieDetails }) {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const { FavoriteIcon } = useFavorites();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row gap-8 p-4 md:p-10 bg-gray-900 rounded-xl shadow-2xl"
    >
      <div className="flex-shrink-0 w-full md:w-1/3 max-w-sm mx-auto md:mx-0 relative">
        <div className="absolute top-2 right-2 z-10">
          <FavoriteIcon
            movieId={movie.id}
            className="text-3xl backdrop-blur-sm bg-black/30 rounded-full"
          />
        </div>

        {movie.poster_path ? (
          <Image
            src={`${IMAGE_PATH}${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="rounded-lg shadow-xl"
            priority
          />
        ) : (
          <div className="w-full h-[450px] flex items-center justify-center bg-gray-700 text-white text-center rounded-lg">
            No Image
          </div>
        )}
      </div>

      <div className="flex-grow text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-2">
          {movie.title}
        </h1>
        <p className="text-xl text-gray-400 mb-6">({releaseYear})</p>

        <h2 className="text-2xl font-bold mt-4 mb-2">Overview</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          {movie.overview || "No overview available."}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-gray-200">Rating:</span>{" "}
            {movie.vote_average?.toFixed(1)} / 10
          </div>
          <div>
            <span className="font-bold text-gray-200">Runtime:</span>{" "}
            {movie.runtime} min
          </div>
          <div>
            <span className="font-bold text-gray-200">Genres:</span>{" "}
            {movie.genres?.map((g) => g.name).join(', ') || 'N/A'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
