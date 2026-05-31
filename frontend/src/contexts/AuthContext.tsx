import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../api/auth';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
    profile_photo?: string;  // 新增
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    updateAvatar: (avatarUrl: string) => void;  // 新增
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getMe()
                .then((res) => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await loginApi({ email, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const register = async (username: string, email: string, password: string, role?: string) => {
        const res = await registerApi({ username, email, password, role });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateAvatar = (avatarUrl: string) => {
        if (user) {
            setUser({ ...user, profile_photo: avatarUrl });
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};