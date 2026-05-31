import { useEffect, useState } from 'react';
import { getFilms, createFilm, updateFilm, deleteFilm } from '../api/films';
import EditFilmModal from '../components/EditFilmModal';

interface Film {
    id: number;
    title: string;
    genre?: string;
    year?: number;
    rating?: number;
    description?: string;
    poster_url?: string;
}

const AdminPanel = () => {
    const [films, setFilms] = useState<Film[]>([]);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [posterUrl, setPosterUrl] = useState('');

    // 编辑模态框状态
    const [editingFilm, setEditingFilm] = useState<Film | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadFilms = async () => {
        const res = await getFilms();
        setFilms(res.data);
    };

    useEffect(() => {
        loadFilms();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const newFilm: any = { title: title.trim() };
        if (genre.trim()) newFilm.genre = genre.trim();
        if (year) newFilm.year = parseInt(year);
        if (rating) newFilm.rating = parseFloat(rating);
        if (description.trim()) newFilm.description = description.trim();
        if (posterUrl.trim()) newFilm.poster_url = posterUrl.trim();

        await createFilm(newFilm);
        setTitle(''); setGenre(''); setYear(''); setRating(''); setDescription(''); setPosterUrl('');
        loadFilms();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this film?')) {
            await deleteFilm(id);
            loadFilms();
        }
    };

    const handleUpdate = async (id: number, updatedData: Partial<Film>) => {
        await updateFilm(id, updatedData);
        loadFilms();
    };

    const openEditModal = (film: Film) => {
        setEditingFilm(film);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingFilm(null);
    };

    return (
        <div>
            <h2>Admin Panel - Manage Films</h2>
            <form onSubmit={handleCreate} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '500px' }}>
                <input placeholder="Title *" value={title} onChange={e => setTitle(e.target.value)} required />
                <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
                <input placeholder="Year" type="number" value={year} onChange={e => setYear(e.target.value)} />
                <input placeholder="Rating (0-10)" type="number" step="0.1" value={rating} onChange={e => setRating(e.target.value)} />
                <textarea placeholder="Description" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                <input placeholder="Poster URL" value={posterUrl} onChange={e => setPosterUrl(e.target.value)} />
                <button type="submit">Add Film</button>
            </form>

            <h3>Existing Films</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {films.map(film => (
                    <li key={film.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem', borderRadius: '8px' }}>
                        <strong>{film.title}</strong> ({film.year || 'N/A'}) - Genre: {film.genre || 'N/A'} - Rating: {film.rating ?? 'N/A'}
                        <div style={{ marginTop: '0.5rem' }}>
                            <button onClick={() => openEditModal(film)} style={{ marginRight: '0.5rem' }}>✏️ Edit</button>
                            <button onClick={() => handleDelete(film.id)} style={{ background: '#ef4444' }}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <EditFilmModal
                film={editingFilm}
                isOpen={isModalOpen}
                onClose={closeEditModal}
                onSave={handleUpdate}
            />
        </div>
    );
};

export default AdminPanel;