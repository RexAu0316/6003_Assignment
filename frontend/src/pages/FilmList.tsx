// src/pages/FilmList.tsx
import { useEffect, useState } from 'react';
import { getFilms, searchFilms } from '../api/films';
import FilmCard from '../components/FilmCard';

interface Film {
  id: number;
  title: string;
  genre: string;
  year: number;
  rating: number;
  description?: string;
  poster_url?: string;
}

const FilmList = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState('');

  const loadFilms = async () => {
    const res = await getFilms();
    setFilms(res.data);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (title.trim()) params.title = title.trim();
    if (genre.trim()) params.genre = genre.trim();
    if (year) params.year = parseInt(year);
    if (minRating) params.minRating = parseFloat(minRating);
    const res = await searchFilms(params);
    setFilms(res.data);
  };

  const handleReset = () => {
    setTitle('');
    setGenre('');
    setYear('');
    setMinRating('');
    loadFilms();
  };

  useEffect(() => {
    loadFilms();
  }, []);

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        <input type="number" step="0.1" placeholder="Min Rating" value={minRating} onChange={e => setMinRating(e.target.value)} />
        <button type="submit">Search</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      {films.map(film => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  );
};

export default FilmList;