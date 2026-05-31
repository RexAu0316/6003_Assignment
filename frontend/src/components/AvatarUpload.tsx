import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadAvatar } from '../api/users';

const AvatarUpload = () => {
    const { user, updateAvatar } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadAvatar(file);
            updateAvatar(res.data.avatarUrl);
            alert('Avatar updated!');
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const avatarUrl = user?.profile_photo ? `http://localhost:5001${user.profile_photo}` : null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {avatarUrl && (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
            )}
            <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <button onClick={triggerFileInput} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Avatar'}
            </button>
        </div>
    );
};

export default AvatarUpload;