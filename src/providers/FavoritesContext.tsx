"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface FavoritesContextType {
  favoriteIds: number[];
  toggleFavorite: (movieId: number) => Promise<void>;
  FavoriteIcon: React.FC<{ movieId: number; className?: string }>;
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) {
          console.error("Failed to fetch favorites:", res.status);
          return;
        }

        const data = await res.json().catch(() => []);
        if (!Array.isArray(data)) {
          console.warn("Invalid favorites response, expected array");
          return;
        }
        interface Favorite {
          movieId: number;
        }
        setFavoriteIds((data as Favorite[]).map(f => f.movieId));
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadFavorites();

    const handleFocus = () => loadFavorites();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const toggleFavorite = async (movieId: number) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
      if (!res.ok) throw new Error("Failed to toggle favorite");

      setFavoriteIds((prev) =>
        prev.includes(movieId)
          ? prev.filter((id) => id !== movieId)
          : [...prev, movieId]
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const FavoriteIcon: React.FC<{ movieId: number; className?: string }> = ({
    movieId,
    className,
  }) => {
    const isFav = favoriteIds.includes(movieId);
    return (
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movieId);
        }}
        className={`${className} p-1 rounded-full transition-all ${
          isFav
            ? "text-red-500 hover:text-red-400"
            : "text-white hover:text-red-500 opacity-75 hover:opacity-100"
        }`}
      >
        <motion.div
          animate={{
            scale: isFav ? [1, 1.4, 1] : [1],
            rotate: isFav ? [0, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart fill={isFav ? "currentColor" : "none"} className="w-6 h-6" />
        </motion.div>
      </motion.button>
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, toggleFavorite, FavoriteIcon, isLoaded }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
