"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { IMAGE_PATH } from "@/services/tmdb";
import { useFavorites } from "@/providers/FavoritesContext";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const { FavoriteIcon } = useFavorites();
  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.03] bg-gray-800 group"
    >

      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteIcon
        
          movieId={movie.id}
          className="text-xl backdrop-blur-sm bg-black/30 rounded-full"
        />
      </div>

      {movie.poster_path ? (
        <Image
          src={`${IMAGE_PATH}${movie.poster_path}`}
          alt={movie.title}
          width={500}
          height={750}
          className="w-full h-auto object-cover aspect-[2/3]"
          priority
        />
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-700 text-white text-center">
          No Image
        </div>
      )}
      <div className="p-3">
        <h3 className="text-white text-sm font-semibold truncate">
          {movie.title}
        </h3>
      </div>
    </div>
  );
}
