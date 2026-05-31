import { useAuth } from '../contexts/AuthContext';
import AvatarUpload from '../components/AvatarUpload';

const Profile = () => {
    const { user } = useAuth();
    if (!user) return <div>Please login</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h2>My Profile</h2>
            <div style={{ marginBottom: '1.5rem' }}>
                <AvatarUpload />
            </div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </div>
    );
};

export default Profile;