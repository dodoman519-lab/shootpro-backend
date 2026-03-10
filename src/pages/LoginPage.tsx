import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <img src="/logo.png" alt="ShootPro" style={{ height: 64, marginBottom: 16 }} />
                    <h1 style={{ fontSize: 28 }}>Connexion</h1>
                    <div className="accent-line" style={{ margin: '12px auto 0' }} />
                </div>

                {error && (
                    <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', color: '#ff6b6b', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={lbl}>Adresse email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} placeholder="vous@email.com" />
                    </div>
                    <div>
                        <label style={lbl}>Mot de passe</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: 8, padding: '16px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: '#666', fontSize: 14 }}>
                    Pas encore de compte ?{' '}
                    <Link to="/register" style={{ color: '#C1784F', fontWeight: 600, textDecoration: 'none' }}>Créer un compte</Link>
                </p>
            </div>
        </div>
    );
};

const lbl: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 13, color: '#888' };
