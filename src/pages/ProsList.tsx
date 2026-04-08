import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from '../config/api';

type Pro = {
    id: string;
    userId: string;
    city: string;
    region: string;
    avgRating: number;
    likesCount: number;
    level: string;
    types: string | string[];
    specialties: string;
    isCertified: boolean;
    user: { name: string };
    services: { id: string; name: string; basePrice: number }[];
    distance?: number;
};

const parse = (v: string | string[]): string[] => {
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v); } catch { return []; }
};

const PRO_TYPES = ['PHOTOGRAPHER', 'VIDEOGRAPHER', 'DJ', 'BEATMAKER', 'STUDIO'];
const SPECIALTIES = [
    { value: 'mariage', label: '💍 Mariage' },
    { value: 'anniversaire', label: '🎂 Anniversaire' },
    { value: 'entreprise', label: '🏢 Soirée / Entreprise' },
    { value: 'pub', label: '📺 Publicité / Pub' },
    { value: 'enregistrement', label: '🎙️ Enregistrement' },
    { value: 'musique', label: '🎵 Musique' },
    { value: 'instrumental', label: '🎹 Création Instrumentale' },
    { value: 'portrait', label: '🖼️ Portrait / Mode' },
    { value: 'clip', label: '🎬 Clip Vidéo' },
];

export const ProsList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pros, setPros] = useState<Pro[]>([]);
    const [city, setCity] = useState("Paris");
    const [region, setRegion] = useState("Île-de-France");
    const [type, setType] = useState<string>('');
    const [specialty, setSpecialty] = useState<string>('');
    const [sort, setSort] = useState<"rating" | "likes" | "recent">("rating");

    useEffect(() => {
        const params = new URLSearchParams();
        if (city) params.append("city", city);
        if (region) params.append("region", region);
        if (type) params.append("type", type);
        if (specialty) params.append("specialty", specialty);
        if (sort !== "recent") params.append("sort", sort);

        fetch(`${API_URL}/pros?${params.toString()}`)
            .then(r => r.json())
            .then(setPros)
            .catch(console.error);
    }, [city, region, type, specialty, sort]);

    const handleContact = (pro: Pro) => {
        if (!user) { navigate('/login'); return; }
        // Créer une chatroom et naviguer vers la messagerie
        fetch(`${API_URL}/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: user.id, proId: pro.userId, senderName: user.name })
        })
            .then(r => r.json())
            .then(room => navigate(`/messages/${room.id}`))
            .catch(() => navigate(`/messages`));
    };

    return (
        <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, marginBottom: 8, textAlign: "center" }}>La crème des Créateurs</h1>
            <p style={{ textAlign: 'center', color: '#888', marginBottom: 32 }}>Trouvez le talent parfait pour votre projet</p>

            {/* Filtres */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 160px' }}>
                        <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Ville</label>
                        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Paris" style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1 1 180px' }}>
                        <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Région</label>
                        <input value={region} onChange={e => setRegion(e.target.value)} placeholder="Île-de-France" style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '1 1 160px' }}>
                        <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Métier</label>
                        <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%' }}>
                            <option value="">Tous les métiers</option>
                            {PRO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Prestation</label>
                        <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ width: '100%' }}>
                            <option value="">Toutes les prestations</option>
                            {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: '1 1 140px' }}>
                        <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Trier par</label>
                        <select value={sort} onChange={e => setSort(e.target.value as any)} style={{ width: '100%' }}>
                            <option value="rating">⭐ Meilleures notes</option>
                            <option value="likes">❤️ Plus populaires</option>
                            <option value="recent">🆕 Récents</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(pos => {
                                    setCity(""); setRegion("");
                                });
                            } else { alert("Géolocalisation non supportée"); }
                        }}
                        className="btn-gold"
                        style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}
                    >
                        📍 Près de moi
                    </button>
                </div>
            </div>

            {/* Filtres rapides prestations */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                <button onClick={() => setSpecialty('')} style={{ ...chipStyle, background: specialty === '' ? 'rgba(193,120,79,0.3)' : 'rgba(255,255,255,0.04)', color: specialty === '' ? '#C1784F' : '#888', border: `1px solid ${specialty === '' ? '#C1784F' : 'rgba(255,255,255,0.1)'}` }}>
                    Tous
                </button>
                {SPECIALTIES.map(s => (
                    <button key={s.value} onClick={() => setSpecialty(specialty === s.value ? '' : s.value)} style={{ ...chipStyle, background: specialty === s.value ? 'rgba(193,120,79,0.3)' : 'rgba(255,255,255,0.04)', color: specialty === s.value ? '#C1784F' : '#888', border: `1px solid ${specialty === s.value ? '#C1784F' : 'rgba(255,255,255,0.1)'}` }}>
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Résultats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {pros.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: '#555' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                        <p>Aucun créatif trouvé pour ces critères.</p>
                    </div>
                )}
                {pros.map((pro) => {
                    const types = parse(pro.types);
                    const specialtiesArr = parse(pro.specialties || '[]');
                    return (
                        <div
                            key={pro.id}
                            className="glass-panel"
                            style={{ padding: 24, display: "flex", flexDirection: "column", transition: "transform 0.3s ease", cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "none"}
                            onClick={() => navigate(`/pro/${pro.id}`)}
                        >
                            {/* Avatar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #C1784F, #1B2A4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                    {pro.user.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontSize: 17, fontWeight: 600, fontFamily: "Playfair Display", color: "#F8E5BA" }}>
                                        {pro.user.name}
                                        {pro.isCertified && <span style={{ fontSize: 14, marginLeft: 6 }}>✅</span>}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#888' }}>{pro.city}, {pro.region}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                                {types.slice(0, 3).map(t => <span key={t} className="badge-navy" style={{ fontSize: 11 }}>{t}</span>)}
                                <span className="badge-copper" style={{ fontSize: 11 }}>{pro.level}</span>
                            </div>

                            {specialtiesArr.length > 0 && (
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                                    {specialtiesArr.slice(0, 3).map((s: string) => {
                                        const found = SPECIALTIES.find(sp => sp.value === s);
                                        return found ? <span key={s} style={{ fontSize: 11, color: '#C1784F', background: 'rgba(193,120,79,0.1)', padding: '2px 8px', borderRadius: 10 }}>{found.label}</span> : null;
                                    })}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 14, color: '#888' }}>
                                <span>⭐ {pro.avgRating.toFixed(1)}</span>
                                <span>❤️ {pro.likesCount}</span>
                                {pro.distance !== undefined && <span>📍 {Math.round(pro.distance)} km</span>}
                            </div>

                            {pro.services[0] && (
                                <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
                                    À partir de <span style={{ color: '#C1784F', fontWeight: 700 }}>{pro.services[0].basePrice}€</span> — {pro.services[0].name}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                                <button
                                    className="btn-gold"
                                    style={{ flex: 1, padding: '10px' }}
                                    onClick={e => { e.stopPropagation(); navigate(`/pro/${pro.id}`); }}
                                >
                                    Voir le profil
                                </button>
                                <button
                                    className="btn-outline"
                                    style={{ padding: '10px 14px', fontSize: 16 }}
                                    onClick={e => { e.stopPropagation(); handleContact(pro); }}
                                    title="Contacter"
                                >
                                    💬
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const chipStyle: React.CSSProperties = {
    border: 'none', borderRadius: 20, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
};
