import React, { useState, useEffect } from 'react';

interface Film {
    id: number;
    title: string;
    genre?: string;
    year?: number;
    rating?: number;
    description?: string;
    poster_url?: string;
}

interface EditFilmModalProps {
    film: Film | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, updatedData: Partial<Film>) => Promise<void>;
}

const EditFilmModal: React.FC<EditFilmModalProps> = ({ film, isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (film) {
            setTitle(film.title);
            setGenre(film.genre || '');
            setYear(film.year?.toString() || '');
            setRating(film.rating?.toString() || '');
            setDescription(film.description || '');
            setPosterUrl(film.poster_url || '');
        }
    }, [film]);

    if (!isOpen || !film) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData: Partial<Film> = {
            title: title.trim(),
        };
        if (genre.trim()) updatedData.genre = genre.trim();
        else updatedData.genre = undefined;
        if (year) updatedData.year = parseInt(year);
        else updatedData.year = undefined;
        if (rating) updatedData.rating = parseFloat(rating);
        else updatedData.rating = undefined;
        if (description.trim()) updatedData.description = description.trim();
        else updatedData.description = undefined;
        if (posterUrl.trim()) updatedData.poster_url = posterUrl.trim();
        else updatedData.poster_url = undefined;

        setSaving(true);
        try {
            await onSave(film.id, updatedData);
            onClose();
        } catch (err) {
            console.error(err);
            alert('更新失败');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                width: '500px',
                maxWidth: '90%',
                maxHeight: '90%',
                overflowY: 'auto',
            }} onClick={(e) => e.stopPropagation()}>
                <h2>Edit Film: {film.title}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Title *</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Genre</label>
                        <input type="text" value={genre} onChange={e => setGenre(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Year</label>
                        <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Rating (0-10)</label>
                        <input type="number" step="0.1" min="0" max="10" value={rating} onChange={e => setRating(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Poster URL</label>
                        <input type="url" value={posterUrl} onChange={e => setPosterUrl(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFilmModal;