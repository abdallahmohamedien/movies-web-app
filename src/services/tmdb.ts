
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500'; 
const REVALIDATE_INTERVAL = 86400; 

export interface MovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;

}


export interface MovieDetails extends MovieListItem {
  overview: string;
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  videos: { 
    results: {
      key: string; 
      site: string; 
      type: string; 
    }[];
  };
}

interface MovieListResponse {
  results: MovieListItem[];
  total_pages: number;
  page: number;
}

export const GENRE_IDS = {
  Action: 28,
  Comedy: 35,
  Romantic: 10749, 
};

export async function fetchMoviesByGenre(genreId: number, page: number = 1): Promise<MovieListResponse> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing. Check .env.local");
  }
  
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL }  });
    

    if (!response.ok) {
      throw new Error(`Failed to fetch movies by genre: ${response.statusText}`);
    }
    const data: MovieListResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching genre ID ${genreId}:`, error);
    return { results: [], total_pages: 0, page: 1 };
  }
}
export async function fetchMovieDetailsList(movieIds: number[]): Promise<MovieDetails[]> {
  if (movieIds.length === 0) {
      return [];
  }

  const detailPromises = movieIds.map(id => getMovieDetails(id));

  try {
      const results = await Promise.allSettled(detailPromises);
      
      return results
          .filter((result): result is PromiseFulfilledResult<MovieDetails> => result.status === 'fulfilled' && !!result.value)
          .map(result => result.value);

  } catch (error) {
      console.error("Error fetching list of movie details:", error);
      return [];
  }
}

export async function getPopularMovies(query?: string, page: number = 1): Promise<MovieListResponse> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing. Check .env.local");
  }
  
  let url;
  
  if (query) {

    const encodedQuery = encodeURIComponent(query);
    url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}&page=${page}`;
  } else {

    url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  }

  try {
    const response = await fetch(url, { next: { revalidate: query ? 300 : REVALIDATE_INTERVAL }  });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }
    
    const data: MovieListResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { results: [], total_pages: 0, page: 1 };
    throw error;
  }
}


export async function getMovieDetails(movieId: string | number): Promise<MovieDetails | null> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing. Check .env.local");
  }
  
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL } }); 

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details for ID ${movieId}: ${response.statusText}`);
    }

    return response.json() as Promise<MovieDetails>;
  } catch (error) {
    console.error(`Error fetching movie ID ${movieId}:`, error);
    return null;
  }
}
