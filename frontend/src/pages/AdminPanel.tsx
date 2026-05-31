import { useEffect, useState } from 'react';
import { getFilms, createFilm, updateFilm, deleteFilm } from '../api/films';

interface Film {
  id: number;
  title: string;
  genre?: string;
  year?: number;
  rating?: number;
}

const AdminPanel = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

  const loadFilms = async () => {
    const res = await getFilms();
    setFilms(res.data);
  };

  useEffect(() => {
    loadFilms();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFilm({ title, genre: genre || undefined, year: year ? parseInt(year) : undefined, rating: rating ? parseFloat(rating) : undefined });
    setTitle(''); setGenre(''); setYear(''); setRating('');
    loadFilms();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this film?')) {
      await deleteFilm(id);
      loadFilms();
    }
  };

  const handleUpdate = async (id: number, newRating: number) => {
    await updateFilm(id, { rating: newRating });
    loadFilms();
  };

  return (
    <div>
      <h2>Admin Panel - Manage Films</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
        <input placeholder="Year" type="number" value={year} onChange={e => setYear(e.target.value)} />
        <input placeholder="Rating" type="number" step="0.1" value={rating} onChange={e => setRating(e.target.value)} />
        <button type="submit">Add Film</button>
      </form>
      <ul>
        {films.map(film => (
          <li key={film.id}>
            {film.title} ({film.year}) - Rating: {film.rating ?? 'N/A'}
            <button onClick={() => handleUpdate(film.id, (film.rating || 0) + 0.5)}>+0.5</button>
            <button onClick={() => handleDelete(film.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;