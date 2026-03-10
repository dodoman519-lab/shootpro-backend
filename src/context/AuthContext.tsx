import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API_URL from '../config/api';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'CLIENT' | 'PRO' | 'ADMIN';
    proProfileId?: string;
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('shootpro_user');
        if (stored) setUser(JSON.parse(stored));
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Erreur connexion');
        }
        const data = await res.json();
        setUser(data);
        localStorage.setItem('shootpro_user', JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('shootpro_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
