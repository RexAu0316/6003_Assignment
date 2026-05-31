import { useEffect, useState } from 'react';
import { getFavorites } from '../api/favorites';
import FilmCard from '../components/FilmCard';

interface Film {
  id: number;
  title: string;
  genre?: string;
  year?: number;
  rating?: number;
  description?: string;
  poster_url?: string;
}

const Favorites = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      setFilms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (films.length === 0) return <div>No favorites yet.</div>;

  return (
    <div>
      <h2>My Favorite Films</h2>
      {films.map(film => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  );
};

export default Favorites;