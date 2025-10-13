export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch movie data" }, { status: 500 });
  }

  const data = await res.json();
  return Response.json(data);
}
