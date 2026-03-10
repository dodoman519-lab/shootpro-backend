import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_URL from '../config/api';

type AdminUser = {
    id: string; name: string; email: string; role: string;
    city?: string; department?: string; createdAt: string; isOnline: boolean;
    siret?: string;
    proProfile?: { id: string; isCertified: boolean; level: string; avgRating: number; profileViews: number } | null;
};

type Stats = {
    totalUsers: number; totalPros: number; totalClients: number;
    totalMessages: number; totalBookings: number; totalContracts: number;
    totalInternships: number; onlineCount: number;
};

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

export const AdminDashboard = () => {
    const { user: authUser } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PRO' | 'CLIENT'>('ALL');
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '', city: '' });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = () => {
        fetch(`${API_URL}/admin/users`).then(r => r.json()).then(setUsers).catch(console.error);
        fetch(`${API_URL}/admin/stats`).then(r => r.json()).then(setStats).catch(console.error);
    };

    const certify = (proId: string, certify: boolean) => {
        fetch(`${API_URL}/admin/pros/${proId}/certify`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ certified: certify })
        }).then(fetchAll).catch(console.error);
    };

    const setLevel = (proId: string, level: string) => {
        fetch(`${API_URL}/admin/pros/${proId}/level`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level })
        }).then(fetchAll).catch(console.error);
    };

    const deleteUser = (userId: string, name: string) => {
        if (!window.confirm(`Supprimer ${name} et toutes ses données ? Action irréversible.`)) return;
        fetch(`${API_URL}/admin/users/${userId}`, { method: "DELETE" }).then(fetchAll).catch(console.error);
    };

    const startEdit = (u: AdminUser) => {
        setEditId(u.id);
        setEditForm({ name: u.name, email: u.email, role: u.role, city: u.city || '' });
    };

    const saveEdit = (userId: string) => {
        fetch(`${API_URL}/admin/users/${userId}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm)
        }).then(() => { setEditId(null); fetchAll(); }).catch(console.error);
    };

    if (!authUser || authUser.role !== 'ADMIN') {
        return <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>🔒 Accès réservé à l'administrateur.</div>;
    }

    const filtered = users.filter(u => {
        const matchRole = filter === 'ALL' || u.role === filter;
        const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.city?.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
    });

    const statCards = stats ? [
        { label: 'Utilisateurs', value: stats.totalUsers, icon: '👥', color: '#C1784F' },
        { label: 'Professionnels', value: stats.totalPros, icon: '🎨', color: '#D4AF37' },
        { label: 'Clients', value: stats.totalClients, icon: '👤', color: '#4CAF50' },
        { label: 'En ligne', value: stats.onlineCount, icon: '🟢', color: '#4CAF50' },
        { label: 'Messages', value: stats.totalMessages, icon: '💬', color: '#1B2A4A' },
        { label: 'Réservations', value: stats.totalBookings, icon: '📅', color: '#C1784F' },
        { label: 'Contrats', value: stats.totalContracts, icon: '📄', color: '#D4AF37' },
        { label: 'Stages', value: stats.totalInternships, icon: '🎓', color: '#888' },
    ] : [];

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <div className="fade-in" style={{ marginBottom: 32 }}>
                <span style={{ background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Admin</span>
                <h1 style={{ fontSize: 40, marginTop: 12 }}>Tableau de Bord</h1>
                <div className="accent-line" />
                <p style={{ color: '#666', marginTop: 8, fontSize: 14 }}>Gérez tous les utilisateurs, certifications et statistiques de la plateforme.</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 36 }}>
                {statCards.map(c => (
                    <div key={c.label} className="glass-panel" style={{ padding: '16px 12px', textAlign: 'center', borderTop: `3px solid ${c.color}` }}>
                        <div style={{ fontSize: 24 }}>{c.icon}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Playfair Display', color: '#F8E5BA', lineHeight: 1.2 }}>{c.value}</div>
                        <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="🔍 Rechercher par nom, email, ville…"
                    style={{ flex: '1 1 220px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#DDD', fontSize: 14, outline: 'none' }}
                />
                {(['ALL', 'PRO', 'CLIENT'] as const).map(r => (
                    <button key={r} onClick={() => setFilter(r)} style={{ padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, background: filter === r ? 'linear-gradient(135deg, #C1784F, #D4AF37)' : 'rgba(255,255,255,0.05)', color: filter === r ? '#000' : '#888' }}>
                        {r === 'ALL' ? 'Tous' : r === 'PRO' ? '🎨 Pros' : '👤 Clients'}
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', fontSize: 13, color: '#555' }}>{filtered.length} utilisateur(s)</div>
            </div>

            {/* Tableau */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                {['Utilisateur', 'Email', 'Rôle', 'Ville', 'Statut', 'Certif.', 'Niveau', 'Vues', 'Inscrit le', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#555', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(193,120,79,0.04)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                                    {editId === u.id ? (
                                        <>
                                            <td style={{ padding: '8px 12px' }}><input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inputSt} /></td>
                                            <td style={{ padding: '8px 12px' }}><input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={inputSt} /></td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} style={inputSt}>
                                                    <option value="CLIENT">CLIENT</option>
                                                    <option value="PRO">PRO</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '8px 12px' }}><input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} style={inputSt} /></td>
                                            <td colSpan={5} />
                                            <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                                                <button onClick={() => saveEdit(u.id)} style={{ ...actionBtn, background: '#4CAF50', color: '#fff', marginRight: 4 }}>✓ Sauv.</button>
                                                <button onClick={() => setEditId(null)} style={{ ...actionBtn }}>✕</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#F8E5BA', whiteSpace: 'nowrap' }}>
                                                <span style={{ marginRight: 6 }}>{u.isOnline ? '🟢' : '⚫'}</span>
                                                {u.name}
                                            </td>
                                            <td style={{ padding: '10px 12px', color: '#888', fontSize: 12 }}>{u.email}</td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{ background: u.role === 'PRO' ? 'rgba(212,175,55,0.15)' : 'rgba(76,175,80,0.12)', color: u.role === 'PRO' ? '#D4AF37' : '#4CAF50', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px', color: '#888', fontSize: 12 }}>{u.city || '—'}</td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{ color: u.isOnline ? '#4CAF50' : '#444', fontSize: 12, fontWeight: 600 }}>
                                                    {u.isOnline ? 'En ligne' : 'Hors ligne'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                {u.proProfile ? (u.proProfile.isCertified
                                                    ? <span style={{ color: '#D4AF37', fontSize: 13 }}>✅</span>
                                                    : <span style={{ color: '#444', fontSize: 13 }}>—</span>)
                                                    : <span style={{ color: '#333', fontSize: 12 }}>N/A</span>}
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                {u.proProfile ? (
                                                    <select value={u.proProfile.level} onChange={e => certify && setLevel(u.proProfile!.id, e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#DDD', borderRadius: 4, padding: '3px 6px', fontSize: 11, cursor: 'pointer' }}>
                                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                                    </select>
                                                ) : '—'}
                                            </td>
                                            <td style={{ padding: '10px 12px', color: '#888', fontSize: 12 }}>{u.proProfile?.profileViews ?? '—'}</td>
                                            <td style={{ padding: '10px 12px', color: '#666', fontSize: 11 }}>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                                            <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    <button onClick={() => startEdit(u)} style={{ ...actionBtn }} title="Modifier">✏️</button>
                                                    {u.proProfile && (
                                                        <button
                                                            onClick={() => certify(u.proProfile!.id, !u.proProfile!.isCertified)}
                                                            style={{ ...actionBtn, background: u.proProfile.isCertified ? 'rgba(255,200,0,0.1)' : 'rgba(76,175,80,0.1)', color: u.proProfile.isCertified ? '#D4AF37' : '#4CAF50' }}
                                                            title={u.proProfile.isCertified ? 'Révoquer certification' : 'Certifier'}
                                                        >
                                                            {u.proProfile.isCertified ? '✅' : '🏅'}
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteUser(u.id, u.name)} style={{ ...actionBtn, background: 'rgba(231,76,60,0.1)', color: '#e74c3c' }} title="Supprimer">🗑</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Aucun utilisateur trouvé.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const inputSt: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#DDD', borderRadius: 4, padding: '5px 8px', fontSize: 12, width: '100%', outline: 'none' };
const actionBtn: React.CSSProperties = { padding: '5px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#888', fontFamily: 'Inter, sans-serif' };
