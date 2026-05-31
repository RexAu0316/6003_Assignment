import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFilmById } from '../api/films';

interface Film {
  id: number;
  title: string;
  genre?: string;
  year?: number;
  rating?: number;
  description?: string;
  poster_url?: string;
}

const FilmDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFilmById(parseInt(id))
      .then(res => setFilm(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!film) return <div>Film not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/">← Back to list</Link>
      <h1>{film.title}</h1>
      {film.poster_url && <img src={film.poster_url} alt={film.title} style={{ maxWidth: '100%' }} />}
      <p><strong>Genre:</strong> {film.genre || 'N/A'}</p>
      <p><strong>Year:</strong> {film.year || 'N/A'}</p>
      <p><strong>Rating:</strong> ⭐ {film.rating ?? 'N/A'}</p>
      <p><strong>Description:</strong> {film.description || 'No description'}</p>
    </div>
  );
};

export default FilmDetail;