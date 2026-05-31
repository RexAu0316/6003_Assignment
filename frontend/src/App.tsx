import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import FilmDetail from './pages/FilmDetail';
import FilmList from './pages/FilmList';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Favorites from './pages/Favorites';
import MyMessages from './pages/MyMessages';
import AdminMessages from './pages/AdminMessages';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<FilmList />} />
          <Route path="/films/:id" element={<FilmDetail />} />
          <Route path="/messages" element={
            <PrivateRoute>
              <MyMessages />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
              <PrivateRoute>
                  <Profile />
              </PrivateRoute>
          } />
          <Route path="/admin/messages" element={
            <PrivateRoute adminOnly>
              <AdminMessages />
            </PrivateRoute>
          } />
          <Route path="/favorites" element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          } />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;