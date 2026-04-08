import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export const RegisterPage = () => {
    const [role, setRole] = useState<'CLIENT' | 'PRO'>('CLIENT');
    const [form, setForm] = useState({ email: '', password: '', name: '', city: '', region: '', department: '', age: '', address: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cguAccepted, setCguAccepted] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cguAccepted) { setError('Vous devez accepter les Conditions Générales d\'Utilisation pour continuer.'); return; }
        setLoading(true); setError('');
        try {
            const endpoint = role === 'PRO' ? '/auth/register-pro' : '/auth/register-client';
            const payload = role === 'PRO'
                ? { ...form, level: 'BEGINNER', types: [], age: form.age ? Number(form.age) : undefined }
                : { email: form.email, password: form.password, name: form.name, age: form.age ? Number(form.age) : undefined, department: form.department, city: form.city, address: form.address };

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
            await login(form.email, form.password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Erreur inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: 480, padding: 40 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <img src="/logo.png" alt="ShootPro" style={{ height: 64, marginBottom: 16 }} />
                    <h1 style={{ fontSize: 28 }}>Créer un compte</h1>
                    <div className="accent-line" style={{ margin: '12px auto 0' }} />
                </div>

                {/* Role Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                    {(['CLIENT', 'PRO'] as const).map(r => (
                        <button key={r} type="button" onClick={() => setRole(r)} style={{
                            padding: '14px', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15, transition: 'all 0.2s',
                            background: role === r ? 'linear-gradient(135deg, #C1784F, #D4AF37)' : 'rgba(255,255,255,0.05)',
                            color: role === r ? '#000' : '#888',
                        }}>
                            {r === 'CLIENT' ? '👤 Client' : '🎨 Professionnel'}
                        </button>
                    ))}
                </div>

                {error && (
                    <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', color: '#ff6b6b', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={lbl}>{role === 'PRO' ? 'Nom / Nom de scène' : 'Votre nom'}</label>
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%' }} placeholder="Alex Morand" />
                    </div>
                    <div>
                        <label style={lbl}>Adresse email</label>
                        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%' }} placeholder="vous@email.com" />
                    </div>
                    <div>
                        <label style={lbl}>Mot de passe</label>
                        <input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '100%' }} placeholder="••••••••" />
                    </div>

                    {role === 'PRO' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={lbl}>Ville *</label>
                                <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%' }} placeholder="Paris" />
                            </div>
                            <div>
                                <label style={lbl}>Région *</label>
                                <input required value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={{ width: '100%' }} placeholder="Île-de-France" />
                            </div>
                        </div>
                    )}

                    {/* Champs supplémentaires CLIENT */}
                    {role === 'CLIENT' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={lbl}>Ville</label>
                                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%' }} placeholder="Paris" />
                                </div>
                                <div>
                                    <label style={lbl}>Département</label>
                                    <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ width: '100%' }} placeholder="75" />
                                </div>
                            </div>
                            <div>
                                <label style={lbl}>Adresse complète (optionnel)</label>
                                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%' }} placeholder="12 rue de la Paix, Paris" />
                                <span style={{ fontSize: 11, color: '#555', display: 'block', marginTop: 4 }}>🔒 Utilisée uniquement pour trouver des pros près de chez vous.</span>
                            </div>
                        </div>
                    )}

                    {/* CGU Acceptance */}
                    <div style={{ background: 'rgba(27,42,74,0.3)', borderRadius: 10, padding: '14px 16px', border: cguAccepted ? '1px solid rgba(193,120,79,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={cguAccepted}
                                onChange={e => { setCguAccepted(e.target.checked); if (error.includes('CGU')) setError(''); }}
                                style={{ marginTop: 2, width: 18, height: 18, cursor: 'pointer', accentColor: '#C1784F' }}
                            />
                            <span style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
                                J'ai lu et j'accepte les{' '}
                                <a href="/cgu" target="_blank" style={{ color: '#C1784F', fontWeight: 600 }}>Conditions Générales d'Utilisation</a>
                                {' '}de ShootPro. Je comprends que la plateforme agit en tant qu'intermédiaire et que mes données seront collectées conformément à la CGU.
                            </span>
                        </label>
                    </div>

                    <div style={{ padding: '10px 14px', background: 'rgba(193,120,79,0.07)', borderRadius: 8, fontSize: 13, color: '#888', lineHeight: 1.5 }}>
                        {role === 'PRO' ? '🎨 Vous pourrez compléter votre profil, ajouter vos photos et gérer votre agenda après inscription.' : '👤 Vous pourrez contacter des créatifs, réserver et valider des contrats.'}
                    </div>

                    <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: 8, padding: '16px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Création...' : `Créer mon compte ${role === 'PRO' ? 'Pro' : 'Client'}`}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: '#666', fontSize: 14 }}>
                    Déjà un compte ?{' '}
                    <Link to="/login" style={{ color: '#C1784F', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
                </p>
            </div>
        </div>
    );
};

const lbl: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 13, color: '#888' };
