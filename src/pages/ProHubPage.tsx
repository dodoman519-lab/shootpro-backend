import React, { useEffect, useState } from 'react';
import API_URL from '../config/api';

type Message = {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
};

type ProUser = {
    id: string;
    name: string;
    city: string;
    level: string;
};

// Hub Pro-to-Pro: communication, matériel et annonces entre professionnels
export const ProHubPage = () => {
    const [activeTab, setActiveTab] = useState<'forum' | 'gear'>('forum');
    const [pros, setPros] = useState<ProUser[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMsg, setNewMsg] = useState('');

    useEffect(() => {
        // Charger les pros pour afficher leurs messages
        fetch(`${API_URL}/pros`)
            .then(r => r.json())
            .then((data: any[]) => setPros(data.map(p => ({ id: p.user.id, name: p.user.name, city: p.city, level: p.level }))))
            .catch(console.error);
        // Charger les messages du forum public (chatRoom dédié ou mock)
        fetch(`${API_URL}/prohub/messages`)
            .then(r => r.json())
            .then(setMessages)
            .catch(() => setMessages([]));
    }, []);

    const sendMessage = () => {
        if (!newMsg.trim()) return;
        const msg = {
            id: Date.now().toString(),
            senderId: 'Pro Demo',
            content: newMsg,
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, msg]);
        setNewMsg('');
    };

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px', minHeight: '100vh' }}>

            <div className="fade-in" style={{ marginBottom: 40 }}>
                <span className="badge-copper" style={{ marginBottom: 12, display: 'inline-block' }}>Espace Exclusif</span>
                <h1 style={{ fontSize: 44 }}>Hub Professionnel</h1>
                <div className="accent-line" />
                <p style={{ color: '#888', marginTop: 4, fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>
                    Cet espace est réservé aux <strong style={{ color: '#C1784F' }}>professionnels vérifiés</strong>.
                    Échangez avec d'autres créatifs, partagez des opportunités et découvrez le matériel disponible.
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
                {(['forum', 'gear'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '10px 24px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                        background: activeTab === tab ? 'rgba(193,120,79,0.2)' : 'transparent',
                        color: activeTab === tab ? '#C1784F' : '#666',
                    }}>
                        {tab === 'forum' ? '💬 Fil de Discussion' : '📦 Matériel'}
                    </button>
                ))}
            </div>

            {/* Forum Tab */}
            {activeTab === 'forum' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
                    <div>
                        <div className="glass-panel" style={{ padding: 24, marginBottom: 16, maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
                                    Aucun message. Lancez la première discussion !
                                </div>
                            )}
                            {messages.map(m => (
                                <div key={m.id} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: '2px solid rgba(193,120,79,0.3)' }}>
                                    <div style={{ fontSize: 13, color: '#C1784F', fontWeight: 600, marginBottom: 6 }}>{m.senderId}</div>
                                    <p style={{ color: '#DDD', lineHeight: 1.6 }}>{m.content}</p>
                                    <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>{new Date(m.createdAt).toLocaleString('fr-FR')}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Écrire un message aux pros..." style={{ flex: 1 }} />
                            <button className="btn-gold" onClick={sendMessage} style={{ padding: '12px 20px' }}>Envoyer</button>
                        </div>
                    </div>

                    {/* Liste des Pros en ligne */}
                    <div className="glass-panel" style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 16, marginBottom: 16, color: '#F8E5BA' }}>Professionnels inscrits</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {pros.map(p => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #C1784F, #1B2A4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: 11, color: '#666' }}>{p.city} · {p.level}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Gear Tab */}
            {activeTab === 'gear' && (
                <GearSection />
            )}
        </div>
    );
};

// Section matériel (location/vente)
const GearSection = () => {
    const [gear, setGear] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', pricePerDay: '', priceSell: '', isForRent: false, isForSale: false, city: '', region: '', ownerId: '' });

    useEffect(() => {
        fetch(`${API_URL}/gear`)
            .then(r => r.json())
            .then(setGear)
            .catch(() => setGear([]));
    }, []);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        fetch(`${API_URL}/gear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, pricePerDay: Number(form.pricePerDay), priceSell: Number(form.priceSell) })
        })
            .then(r => r.json())
            .then(item => { setGear(prev => [item, ...prev]); setShowForm(false); })
            .catch(() => alert('Erreur'));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 24 }}>Matériel entre Pros</h2>
                <button className="btn-gold" onClick={() => setShowForm(!showForm)}>+ Déposer une annonce</button>
            </div>

            {showForm && (
                <div className="glass-panel fade-in" style={{ padding: 24, marginBottom: 24, borderLeft: '3px solid #C1784F' }}>
                    <h3 style={{ marginBottom: 20 }}>Nouvelle annonce matériel</h3>
                    <form onSubmit={handlePost} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={{ display: 'block', marginBottom: 6, color: '#888', fontSize: 13 }}>Titre *</label>
                            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%' }} placeholder="Sony A7 III, Drone DJI..." />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={{ display: 'block', marginBottom: 6, color: '#888', fontSize: 13 }}>Description</label>
                            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', resize: 'vertical' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, color: '#888', fontSize: 13 }}>Ville</label>
                            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, color: '#888', fontSize: 13 }}>Région</label>
                            <input value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, color: '#888', fontSize: 13 }}>Prix/jour (location, €)</label>
                            <input type="number" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, color: '#888', fontSize: 13 }}>Prix vente (€)</label>
                            <input type="number" value={form.priceSell} onChange={e => setForm({ ...form, priceSell: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                            <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#C1784F', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.isForRent} onChange={e => setForm({ ...form, isForRent: e.target.checked })} /> Location
                            </label>
                            <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#C1784F', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.isForSale} onChange={e => setForm({ ...form, isForSale: e.target.checked })} /> Vente
                            </label>
                        </div>
                        <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Annuler</button>
                            <button type="submit" className="btn-gold">Publier</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {gear.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: '#555' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                        <p>Aucune annonce matériel. Déposez la première !</p>
                    </div>
                )}
                {gear.map((g: any) => (
                    <div key={g.id} className="glass-panel" style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 17, color: '#F8E5BA', marginBottom: 8 }}>{g.title}</h3>
                        {g.description && <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{g.description}</p>}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                            {g.isForRent && g.pricePerDay && <span className="badge-copper">{g.pricePerDay}€/jour</span>}
                            {g.isForSale && g.priceSell && <span className="badge-navy">Vente: {g.priceSell}€</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#555' }}>📍 {g.city}, {g.region}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
