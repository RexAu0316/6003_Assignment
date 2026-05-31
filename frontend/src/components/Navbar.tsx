import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f8f9fa', marginBottom: '1rem' }}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <span>Welcome, {user.username} ({user.role})</span>

          <Link to="/favorites">My Favorites</Link>
          <Link to="/messages">My Messages</Link>
          <Link to="/profile">Profile</Link>
          {user.role === 'admin' && (
            <>
              <Link to="/admin">Admin Panel</Link>
              <Link to="/admin/messages">Manage Messages</Link>
            </>
          )}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;