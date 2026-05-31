import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorites';
import { useState, useEffect } from 'react';

interface Film {
  id: number;
  title: string;
  genre?: string;
  year?: number;
  rating?: number;
  description?: string;
  poster_url?: string;
}

const FilmCard = ({ film }: { film: Film }) => {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!user) return;
    // 检查是否已收藏
    getFavorites().then(res => {
      const favIds = res.data.map((f: any) => f.id);
      setIsFav(favIds.includes(film.id));
    }).catch(err => console.error(err));
  }, [user, film.id]);

  const handleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    try {
      if (isFav) {
        await removeFavorite(film.id);
        setIsFav(false);
      } else {
        await addFavorite(film.id);
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
      alert('Operation failed');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
      <h3><Link to={`/films/${film.id}`}>{film.title}</Link></h3>
      <p>{film.genre} | {film.year} | ⭐ {film.rating ?? 'N/A'}</p>
      {film.description && <p>{film.description.substring(0, 100)}...</p>}
      {user && (
        <button onClick={handleFavorite} style={{ background: isFav ? '#ef4444' : '#3b82f6' }}>
          {isFav ? '❤️ Favorited' : '♡ Add to favorites'}
        </button>
      )}
    </div>
  );
};

export default FilmCard;