import React from 'react';

export default function MovieCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 animate-pulse">
      
      <div className="w-full aspect-[2/3] bg-gray-700">
      </div>
      
      <div className="p-3">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div> 
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}