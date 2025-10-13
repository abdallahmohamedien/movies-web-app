
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { Loader2 } from 'lucide-react';

export default function GenreLoading() {
  const skeletons = Array.from({ length: 18 }); 

  return (
    <main>
      <div className="h-8 bg-gray-700 rounded w-64 mb-6 animate-pulse"></div> 
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {skeletons.map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
      
      <div className="flex justify-center mt-10">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    </main>
  );
}