import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

type Contract = {
    id: string;
    proId: string;
    clientId: string;
    title: string;
    description: string;
    address: string;
    price: number;
    eventDate?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    pro: { name: string };
    client: { name: string };
};

export const ContractPage = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [form, setForm] = useState({ clientId: '', title: '', description: '', address: '', price: '', eventDate: '' });

    useEffect(() => {
        if (!user) return;
        load();
        // Pour le pro: charger la liste des clients qui ont une conversation ouverte
        if (user.role === 'PRO') {
            fetch(`${API_URL}/chats/user/${user.id}`)
                .then(r => r.json())
                .then(rooms => setClients(rooms.map((r: any) => ({ id: r.client.id, name: r.client.name }))))
                .catch(console.error);
        }
    }, [user]);

    const load = () => {
        if (!user) return;
        fetch(`${API_URL}/contracts/user/${user.id}`)
            .then(r => r.json())
            .then(setContracts)
            .catch(console.error);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        fetch(`${API_URL}/contracts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, proId: user.id, price: Number(form.price) })
        })
            .then(r => r.json())
            .then(() => { load(); setShowForm(false); setForm({ clientId: '', title: '', description: '', address: '', price: '', eventDate: '' }); })
            .catch(() => alert('Erreur envoi contrat'));
    };

    const handleStatus = (id: string, status: 'ACCEPTED' | 'REJECTED') => {
        fetch(`${API_URL}/contracts/${id}/status`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
            .then(() => load())
            .catch(console.error);
    };

    if (!user) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Connectez-vous pour accéder à vos contrats.<br /><a href="/login" style={{ color: '#C1784F' }}>Se connecter</a></div>;

    const statusBadge = (s: string) => ({
        PENDING: { color: '#FFB347', label: '⏳ En attente' },
        ACCEPTED: { color: '#4CAF50', label: '✅ Accepté' },
        REJECTED: { color: '#e74c3c', label: '❌ Refusé' },
    }[s] || { color: '#888', label: s });

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px' }}>
            <div className="fade-in" style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <span className="badge-copper" style={{ marginBottom: 12, display: 'inline-block' }}>Mes Contrats</span>
                    <h1 style={{ fontSize: 40 }}>Contrats & Devis</h1>
                    <div className="accent-line" />
                </div>
                {user.role === 'PRO' && (
                    <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Fermer' : '📝 Nouveau contrat'}
                    </button>
                )}
            </div>

            {/* Formulaire création de contrat (Pro uniquement) */}
            {showForm && user.role === 'PRO' && (
                <div className="glass-panel fade-in" style={{ padding: 28, marginBottom: 32, borderLeft: '3px solid #C1784F' }}>
                    <h2 style={{ fontSize: 22, marginBottom: 20 }}>Créer un contrat</h2>
                    <form onSubmit={handleSend} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={lbl}>Client destinataire</label>
                            <select required value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} style={{ width: '100%' }}>
                                <option value="">-- Sélectionner un client --</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {clients.length === 0 && <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Aucun client en conversation. Demandez-leur de vous contacter d'abord via votre profil.</p>}
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={lbl}>Titre de la prestation *</label>
                            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%' }} placeholder="Séance photo mariage – Lyon" />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={lbl}>Description / Détails *</label>
                            <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', resize: 'vertical' }} placeholder="Détaillez les prestations incluses, durée, livraison..." />
                        </div>
                        <div>
                            <label style={lbl}>Adresse de l'événement *</label>
                            <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%' }} placeholder="12 Rue de la Paix, Lyon" />
                        </div>
                        <div>
                            <label style={lbl}>Prix total (€) *</label>
                            <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{ width: '100%' }} placeholder="500" />
                        </div>
                        <div>
                            <label style={lbl}>Date de l'événement</label>
                            <input type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Annuler</button>
                            <button type="submit" className="btn-gold">Envoyer le contrat</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des contrats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {contracts.length === 0 && (
                    <div style={{ padding: 48, textAlign: 'center', color: '#555' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                        <p>Aucun contrat pour le moment.</p>
                    </div>
                )}
                {contracts.map(c => {
                    const badge = statusBadge(c.status);
                    const isClient = user.id === c.clientId;
                    return (
                        <div key={c.id} className="glass-panel" style={{ padding: 28, borderLeft: `3px solid ${badge.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                                <div>
                                    <h3 style={{ fontSize: 20, color: '#F8E5BA', marginBottom: 8 }}>{c.title}</h3>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ color: badge.color, fontSize: 14, fontWeight: 600 }}>{badge.label}</span>
                                        <span className="badge-navy">{isClient ? `📤 De : ${c.pro.name}` : `📩 Pour : ${c.client.name}`}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Playfair Display', color: '#C1784F' }}>{c.price}€</div>
                                    {c.eventDate && <div style={{ fontSize: 13, color: '#666' }}>📅 {new Date(c.eventDate).toLocaleDateString('fr-FR')}</div>}
                                </div>
                            </div>
                            <p style={{ color: '#999', lineHeight: 1.7, fontSize: 15, marginBottom: 12 }}>{c.description}</p>
                            <div style={{ color: '#777', fontSize: 13 }}>📍 {c.address}</div>

                            {/* Client peut accepter/refuser si en attente */}
                            {isClient && c.status === 'PENDING' && (
                                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                                    <button className="btn-gold" onClick={() => handleStatus(c.id, 'ACCEPTED')} style={{ padding: '12px 24px' }}>✅ Accepter le contrat</button>
                                    <button className="btn-outline" onClick={() => handleStatus(c.id, 'REJECTED')} style={{ padding: '12px 24px', borderColor: '#e74c3c', color: '#e74c3c' }}>❌ Refuser</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const lbl: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 13, color: '#888' };
