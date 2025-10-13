import { fetchMoviesByGenre, GENRE_IDS, MovieListItem } from "@/services/tmdb";
import MovieCard from "@/components/MovieCard";
import { notFound } from "next/navigation";
import PaginationControls from "@/components/PaginationControls";

interface GenrePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

function getGenreName(id: number): string | undefined {
  const entry = Object.entries(GENRE_IDS).find(
    ([, genreId]) => genreId === id
  );
  return entry ? entry[0] : undefined;
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {

  const { id } = await params;
  const { page } = await searchParams;

  const genreId = Number(id);
  const currentPage = Number(page) || 1;

  if (isNaN(genreId) || !getGenreName(genreId)) {
    return notFound();
  }

  const { results: movies, total_pages, page: fetchedPage } =
    await fetchMoviesByGenre(genreId, currentPage);

  const genreName = getGenreName(genreId) || "Unknown Genre";

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center text-xl p-10 text-white">
        No movies found for the category &quot;{genreName}&quot;.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-yellow-500 border-b-2 border-yellow-700 pb-2">
        {genreName} Movies
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie: MovieListItem) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <PaginationControls
        currentPage={fetchedPage}
        totalPages={total_pages}
        basePath={`/genre/${genreId}`}
      />
    </main>
  );
}
