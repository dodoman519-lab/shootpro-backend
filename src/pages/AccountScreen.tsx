import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_URL from '../config/api';

type UserAccount = {
    id: string; email: string; name: string; role: string;
    age?: number; avatarUrl?: string; department?: string; city?: string; address?: string; siret?: string;
    proProfile?: {
        id: string;
        level: string; types: string; bio: string | null;
        websiteUrl: string | null; city: string; region: string;
        department?: string; siret?: string;
        profileViews: number; completedJobs: number; isCertified: boolean;
        photoUrl1?: string; photoUrl2?: string; photoUrl3?: string;
        videoUrl1?: string; videoUrl2?: string;
        priceClip?: number; priceStudio?: number; priceMix?: number;
        priceInstrumental?: number; pricePhoto?: number;
    };
};

const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
    });

export const AccountScreen = () => {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<UserAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'media' | 'tarifs'>('info');
    const avatarRef = useRef<HTMLInputElement>(null);
    const photo1Ref = useRef<HTMLInputElement>(null);
    const photo2Ref = useRef<HTMLInputElement>(null);
    const photo3Ref = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: "", age: "", avatarUrl: "", city: "", department: "", address: "", siret: "",
        region: "", bio: "", websiteUrl: "",
        photoUrl1: "", photoUrl2: "", photoUrl3: "",
        videoUrl1: "", videoUrl2: "",
        priceClip: "", priceStudio: "", priceMix: "", priceInstrumental: "", pricePhoto: "",
    });

    useEffect(() => {
        if (authUser) loadUser(authUser.id);
        else setLoading(false);
    }, [authUser]);

    const loadUser = (id: string) => {
        fetch(`${API_URL}/users/${id}`)
            .then(r => r.json())
            .then(data => {
                setUser(data);
                setForm({
                    name: data.name || "",
                    age: data.age ? String(data.age) : "",
                    avatarUrl: data.avatarUrl || "",
                    city: data.proProfile?.city || data.city || "",
                    department: data.proProfile?.department || data.department || "",
                    address: data.address || "",
                    siret: data.siret || data.proProfile?.siret || "",
                    region: data.proProfile?.region || "",
                    bio: data.proProfile?.bio || "",
                    websiteUrl: data.proProfile?.websiteUrl || "",
                    photoUrl1: data.proProfile?.photoUrl1 || "",
                    photoUrl2: data.proProfile?.photoUrl2 || "",
                    photoUrl3: data.proProfile?.photoUrl3 || "",
                    videoUrl1: data.proProfile?.videoUrl1 || "",
                    videoUrl2: data.proProfile?.videoUrl2 || "",
                    priceClip: data.proProfile?.priceClip ? String(data.proProfile.priceClip) : "",
                    priceStudio: data.proProfile?.priceStudio ? String(data.proProfile.priceStudio) : "",
                    priceMix: data.proProfile?.priceMix ? String(data.proProfile.priceMix) : "",
                    priceInstrumental: data.proProfile?.priceInstrumental ? String(data.proProfile.priceInstrumental) : "",
                    pricePhoto: data.proProfile?.pricePhoto ? String(data.proProfile.pricePhoto) : "",
                });
                setLoading(false);
            }).catch(() => setLoading(false));
    };

    const handleFileUpload = async (file: File, key: 'avatarUrl' | 'photoUrl1' | 'photoUrl2' | 'photoUrl3') => {
        if (file.size > 5 * 1024 * 1024) { alert('Image trop grande (max 5 Mo)'); return; }
        const base64 = await toBase64(file);
        setForm(f => ({ ...f, [key]: base64 }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) return;
        fetch(`${API_URL}/users/${authUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, age: form.age ? Number(form.age) : undefined })
        })
            .then(r => r.json())
            .then(() => { setSaved(true); setTimeout(() => setSaved(false), 3000); loadUser(authUser.id); })
            .catch(() => alert("Erreur mise à jour"));
    };

    if (!authUser) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Connectez-vous pour accéder à votre compte.<br /><a href="/login" style={{ color: '#C1784F' }}>Se connecter</a></div>;
    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>;
    if (!user) return <div style={{ padding: 40, color: '#888' }}>Compte introuvable.</div>;

    const isPro = user.role === "PRO";

    const tabs = isPro
        ? [{ id: 'info', label: '👤 Profil' }, { id: 'media', label: '📸 Médias & Vidéos' }, { id: 'tarifs', label: '💶 Tarifs' }]
        : [{ id: 'info', label: '👤 Profil' }];

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
            <div className="fade-in" style={{ marginBottom: 32 }}>
                <span className="badge-copper" style={{ marginBottom: 12, display: 'inline-block' }}>Espace Privé</span>
                <h1 style={{ fontSize: 44 }}>Mon Compte</h1>
                <div className="accent-line" />
            </div>

            {saved && <div style={{ background: 'rgba(193,120,79,0.15)', border: '1px solid #C1784F', borderRadius: 10, padding: '12px 20px', marginBottom: 24, color: '#C1784F', fontWeight: 600 }}>✅ Profil mis à jour avec succès !</div>}

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>

                {/* Sidebar gauche */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
                    {/* Avatar */}
                    <div className="glass-panel" style={{ padding: 24, textAlign: 'center', width: 220 }}>
                        <div
                            onClick={() => avatarRef.current?.click()}
                            style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 12px', overflow: 'hidden', background: 'linear-gradient(135deg, #C1784F, #1B2A4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, cursor: 'pointer', position: 'relative' }}
                            title="Cliquer pour changer la photo"
                        >
                            {form.avatarUrl
                                ? <img src={form.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span>{user.name.charAt(0)}</span>}
                            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#C1784F', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📷</div>
                        </div>
                        <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'avatarUrl')} />
                        <div style={{ fontSize: 10, color: '#555', marginBottom: 8 }}>Cliquer sur la photo pour changer</div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#F8E5BA' }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            {isPro ? '🎨 Professionnel' : '👤 Client'}
                        </div>
                        {isPro && user.proProfile?.isCertified && (
                            <div style={{ marginTop: 8, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: '#D4AF37', fontWeight: 600 }}>✅ CERTIFIÉ SHOOTPRO</div>
                        )}
                        <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{user.email}</div>
                    </div>

                    {isPro && user.proProfile && (
                        <>
                            <div className="glass-panel" style={{ padding: 20, textAlign: 'center', borderTop: '3px solid #C1784F' }}>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#555' }}>Vues du profil</div>
                                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Playfair Display', color: '#F8E5BA' }}>{user.proProfile.profileViews}</div>
                            </div>
                            <div className="glass-panel" style={{ padding: 20, textAlign: 'center', borderTop: '3px solid #1B2A4A' }}>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#555' }}>Collaborations</div>
                                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Playfair Display', color: '#F8E5BA' }}>{user.proProfile.completedJobs}</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Formulaire principal */}
                <div style={{ flex: '1 1 420px' }}>
                    {/* Onglets */}
                    <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
                        {tabs.map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, transition: 'all 0.2s', background: activeTab === t.id ? 'linear-gradient(135deg, #C1784F, #D4AF37)' : 'rgba(255,255,255,0.05)', color: activeTab === t.id ? '#000' : '#888' }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="glass-panel" style={{ padding: 28 }}>

                            {/* ─── INFO ─── */}
                            {activeTab === 'info' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <h2 style={{ fontSize: 20, marginBottom: 4 }}>Informations personnelles</h2>
                                    <Row>
                                        <Field label="Nom complet"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%' }} /></Field>
                                        <Field label="Âge"><input type="number" min="14" max="100" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} style={{ width: '100%' }} placeholder="25" /></Field>
                                    </Row>
                                    <Row>
                                        <Field label="Ville"><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%' }} /></Field>
                                        <Field label="Département (75, 69…)"><input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ width: '100%' }} /></Field>
                                    </Row>
                                    {isPro && (
                                        <>
                                            <Field label="Région"><input value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={{ width: '100%' }} /></Field>
                                            <Field label="Biographie"><textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ width: '100%', resize: 'vertical' }} /></Field>
                                            <Field label="Site Web / Portfolio">
                                                <input type="url" value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })} style={{ width: '100%' }} placeholder="https://..." />
                                            </Field>
                                            <Field label="Numéro SIRET (optionnel)">
                                                <input value={form.siret} onChange={e => setForm({ ...form, siret: e.target.value })} style={{ width: '100%' }} placeholder="ex: 123 456 789 00012" maxLength={20} />
                                                <span style={{ fontSize: 11, color: '#555', marginTop: 4, display: 'block' }}>Renforce la confiance des clients. Non obligatoire.</span>
                                            </Field>
                                        </>
                                    )}
                                    {!isPro && (
                                        <>
                                            <Field label="Adresse complète (pour géolocalisation)">
                                                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%' }} placeholder="12 rue de la Paix, Paris" />
                                                <span style={{ fontSize: 11, color: '#555', display: 'block', marginTop: 4 }}>🔒 Jamais partagée publiquement.</span>
                                            </Field>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ─── MÉDIAS ─── */}
                            {activeTab === 'media' && isPro && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <h2 style={{ fontSize: 20, marginBottom: 4 }}>📸 Photos de mon travail</h2>
                                    <p style={{ fontSize: 13, color: '#666', marginTop: -8 }}>Uploadez directement vos images (max 5 Mo chacune). Elles apparaissent sur votre profil public.</p>

                                    {[
                                        { key: 'photoUrl1' as const, ref: photo1Ref, label: 'Photo 1' },
                                        { key: 'photoUrl2' as const, ref: photo2Ref, label: 'Photo 2' },
                                        { key: 'photoUrl3' as const, ref: photo3Ref, label: 'Photo 3' },
                                    ].map(({ key, ref: fRef, label }) => (
                                        <div key={key} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                            <div
                                                onClick={() => fRef.current?.click()}
                                                style={{ width: 100, height: 100, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(193,120,79,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                            >
                                                {form[key]
                                                    ? <img src={form[key]} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <div style={{ textAlign: 'center', color: '#555', fontSize: 12 }}><div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>Choisir</div>}
                                            </div>
                                            <input ref={fRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], key)} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: '#F8E5BA', marginBottom: 4 }}>{label}</div>
                                                {form[key]
                                                    ? <><span style={{ fontSize: 12, color: '#4CAF50' }}>✓ Image chargée</span><br />
                                                        <button type="button" onClick={() => setForm(f => ({ ...f, [key]: '' }))} style={{ marginTop: 6, fontSize: 11, background: 'transparent', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}>Supprimer</button></>
                                                    : <span style={{ fontSize: 12, color: '#555' }}>Cliquer sur le cadre pour choisir une image</span>}
                                            </div>
                                        </div>
                                    ))}

                                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
                                    <h2 style={{ fontSize: 20 }}>🎬 Liens Vidéo (YouTube / Vimeo)</h2>
                                    {(['videoUrl1', 'videoUrl2'] as const).map((key, i) => (
                                        <Field key={key} label={`Vidéo ${i + 1}`}>
                                            <input type="url" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%' }} placeholder="https://youtube.com/..." />
                                        </Field>
                                    ))}
                                </div>
                            )}

                            {/* ─── TARIFS ─── */}
                            {activeTab === 'tarifs' && isPro && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <h2 style={{ fontSize: 20, marginBottom: 4 }}>💶 Mes Tarifs par prestation</h2>
                                    <p style={{ fontSize: 13, color: '#666' }}>Laissez vide si vous ne proposez pas cette prestation.</p>
                                    {[
                                        { key: 'pricePhoto', label: '📸 Séance Photo', placeholder: 'ex: 150' },
                                        { key: 'priceClip', label: '🎬 Clip Vidéo', placeholder: 'ex: 800' },
                                        { key: 'priceStudio', label: '🎙️ Studio / Enregistrement', placeholder: 'ex: 300' },
                                        { key: 'priceMix', label: '🎛️ Mixage / Mastering', placeholder: 'ex: 150' },
                                        { key: 'priceInstrumental', label: '🎹 Création Instrumentale', placeholder: 'ex: 200' },
                                    ].map(({ key, label, placeholder }) => (
                                        <Field key={key} label={`${label} (€)`}>
                                            <input type="number" min="0" value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%' }} placeholder={placeholder} />
                                        </Field>
                                    ))}
                                </div>
                            )}

                            <button type="submit" className="btn-gold" style={{ marginTop: 24, padding: '14px', fontSize: 15, width: '100%' }}>
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ flex: 1 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>{label}</label>
        {children}
    </div>
);
const Row = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{children}</div>
);
