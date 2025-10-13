import Image from "next/image";
import { getMovieDetails, IMAGE_PATH } from "@/services/tmdb";
import { notFound } from "next/navigation";

interface MovieDetailsProps {
  params: {
    id: string;
  };
}


interface Genre {
  id: number;
  name: string;
}

export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) {
    return notFound();
  }

  const movie = await getMovieDetails(movieId);

  if (!movie) {
    return notFound();
  }

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10 bg-gray-900 rounded-xl shadow-2xl">
      <div className="flex-shrink-0 w-full md:w-1/3 max-w-sm mx-auto md:mx-0">
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
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-500 mb-2">
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
            {movie.genres
              ?.map((g: Genre) => g.name)
              .join(", ") || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
