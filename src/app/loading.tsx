import MovieCardSkeleton from "@/components/MovieCardSkeleton";

export default function HomeLoading() {
  const skeletons = Array.from({ length: 18 });

  return (
    <main>
      <div className="h-8 bg-gray-700 rounded w-80 mb-6 animate-pulse"></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {skeletons.map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
