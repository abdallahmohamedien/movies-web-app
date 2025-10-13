import { getPopularMovies } from "@/services/tmdb";
import MovieCard from "@/components/MovieCard";
import PaginationControls from "@/components/PaginationControls";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.search;
  const currentPage = Number(awaitedSearchParams.page) || 1;

  const {
    results: movies,
    total_pages,
    page: fetchedPage,
  } = await getPopularMovies(query, currentPage);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-yellow-500 border-b-2 border-yellow-700 pb-2">
        {query ? `Search Results for "${query}"` : "Popular Movies"}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <PaginationControls
        currentPage={fetchedPage}
        totalPages={total_pages}
        basePath={query ? `/?search=${query}` : "/"}
      />
    </main>
  );
}
