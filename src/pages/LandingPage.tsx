import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>

            {/* ═══════ HERO ═══════ */}
            <section style={{
                minHeight: '90vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '80px 32px', position: 'relative', overflow: 'hidden'
            }}>
                {/* Fond lumineux cuivré subtil */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(193,120,79,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(27,42,74,0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />

                {/* LOGO — coins arrondis + lueur dorée pour fondre les bords */}
                <img
                    className="fade-in"
                    src="/logo.png"
                    alt="ShootPro – Trouve ton créateur"
                    style={{
                        width: '300px', maxWidth: '68vw',
                        display: 'block',
                        marginBottom: 32,
                        borderRadius: '28px',
                        boxShadow: '0 0 0 1px rgba(193,120,79,0.15), 0 20px 80px rgba(193,120,79,0.45), 0 0 60px rgba(0,0,0,0.9)',
                        animationDelay: '0s',
                    }}
                />

                {/* Titre principal */}
                <h1 className="fade-in" style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 700, lineHeight: 1.15, maxWidth: 800, marginBottom: 8, animationDelay: '0.15s' }}>
                    ShootPro
                </h1>
                <div className="fade-in" style={{ animationDelay: '0.2s' }}>
                    <span style={{
                        fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 400,
                        background: 'linear-gradient(135deg, #C1784F, #D4AF37, #C1784F)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        fontFamily: 'Playfair Display, serif', fontStyle: 'italic'
                    }}>
                        Trouve ton créateur
                    </span>
                </div>

                <p className="fade-in" style={{ fontSize: 18, color: '#999', maxWidth: 560, lineHeight: 1.8, margin: '32px 0 48px', animationDelay: '0.3s' }}>
                    La plateforme qui connecte les créatifs professionnels — photographes, vidéastes, DJs, beatmakers — avec les clients qui cherchent l'excellence.
                </p>

                <div className="fade-in" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.4s' }}>
                    <Link to="/explore">
                        <button className="btn-gold" style={{ fontSize: 16, padding: '16px 40px' }}>
                            🔍 Explorer les Créateurs
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="btn-outline" style={{ fontSize: 16, padding: '16px 40px' }}>
                            Créer mon Compte
                        </button>
                    </Link>
                </div>

                {/* Scroll indicator */}
                <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#444', fontSize: 12 }}>
                    <span>Découvrir</span>
                    <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(193,120,79,0.5), transparent)' }} />
                </div>
            </section>

            {/* ═══════ CHIFFRES ═══════ */}
            <section style={{ padding: '60px 32px', borderTop: '1px solid rgba(193,120,79,0.1)', borderBottom: '1px solid rgba(193,120,79,0.1)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
                    {[
                        { n: '500+', label: 'Créatifs inscrits' },
                        { n: '5', label: 'Disciplines artistiques' },
                        { n: '100+', label: 'Villes couvertes' },
                        { n: '4.8★', label: 'Note moyenne' },
                    ].map(s => (
                        <div key={s.label}>
                            <div style={{ fontSize: 40, fontWeight: 700, fontFamily: 'Playfair Display', color: '#C1784F' }}>{s.n}</div>
                            <div style={{ fontSize: 14, color: '#666', marginTop: 6 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ FONCTIONNALITÉS ═══════ */}
            <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <h2 style={{ fontSize: 38, marginBottom: 12 }}>Ce que vous trouverez</h2>
                    <div className="accent-line" style={{ margin: '0 auto' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {features.map((f, i) => (
                        <Link key={i} to={f.link} style={{ textDecoration: 'none' }}>
                            <div className="glass-panel" style={{ padding: 28, height: '100%', transition: 'transform 0.3s', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                                <div style={{ fontSize: 42, marginBottom: 14 }}>{f.icon}</div>
                                <h3 style={{ fontSize: 20, marginBottom: 10, color: '#F8E5BA' }}>{f.title}</h3>
                                <p style={{ color: '#777', lineHeight: 1.75, fontSize: 14 }}>{f.desc}</p>
                                <div style={{ marginTop: 18, color: '#C1784F', fontSize: 13, fontWeight: 600 }}>En savoir plus →</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══════ TYPES DE PROS ═══════ */}
            <section style={{ padding: '64px 32px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(193,120,79,0.08)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: 34, marginBottom: 40 }}>Les créatifs disponibles</h2>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {proTypes.map(t => (
                            <Link key={t.label} to="/explore" style={{ textDecoration: 'none' }}>
                                <div style={{ background: 'rgba(193,120,79,0.06)', border: '1px solid rgba(193,120,79,0.18)', borderRadius: 60, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(193,120,79,0.18)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#C1784F'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(193,120,79,0.06)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(193,120,79,0.18)'; }}>
                                    <span style={{ fontSize: 26 }}>{t.icon}</span>
                                    <span style={{ fontWeight: 600, color: '#DDD', fontSize: 15 }}>{t.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ CTA FINAL ═══════ */}
            <section style={{ padding: '80px 32px', textAlign: 'center' }}>
                <img src="/logo.png" alt="ShootPro" style={{ height: 80, marginBottom: 24, filter: 'drop-shadow(0 4px 20px rgba(193,120,79,0.4))' }} />
                <h2 style={{ fontSize: 36, marginBottom: 16 }}>Prêt à commencer ?</h2>
                <p style={{ color: '#666', marginBottom: 32 }}>Rejoignez ShootPro gratuitement dès aujourd'hui.</p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/register"><button className="btn-gold" style={{ fontSize: 15, padding: '14px 36px' }}>Je crée mon compte</button></Link>
                    <Link to="/explore"><button className="btn-outline" style={{ fontSize: 15, padding: '14px 36px' }}>Parcourir les Pros</button></Link>
                </div>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid #111', color: '#333', fontSize: 13 }}>
                <img src="/logo.png" alt="ShootPro" style={{ height: 36, opacity: 0.5, marginBottom: 12 }} />
                <p>© 2025 ShootPro – Trouve ton créateur · Tous droits réservés</p>
            </footer>
        </div>
    );
};

const features = [
    { icon: '🔍', title: 'Trouver un Créateur', desc: 'Recherchez par ville, département, prestation (mariage, clip, studio...) et filtrez par note ou popularité.', link: '/explore' },
    { icon: '🎓', title: 'Espace Stagiaires', desc: 'Déposez ou consultez des offres de stage dans la création. Partagez vos conventions et rapports en PDF.', link: '/stagiaires' },
    { icon: '📅', title: 'Agenda & Réservations', desc: 'Les pros gèrent leurs créneaux, les clients voient les disponibilités et réservent directement.', link: '/explore' },
    { icon: '📄', title: 'Contrats Digital', desc: 'Le pro envoie un contrat (tarifs, prestation, adresse). Le client lit et valide directement sur la plateforme.', link: '/contracts' },
    { icon: '📦', title: 'Matériel Pro', desc: 'Achetez ou louez du matériel entre créatifs. Espace réservé aux professionnels.', link: '/pro-hub' },
    { icon: '👤', title: 'Mon Compte', desc: 'Photo de profil, portfolio, vidéos, tarifs, statistiques de vues et de collaborations.', link: '/account' },
];

const proTypes = [
    { icon: '📸', label: 'Photographe' }, { icon: '🎬', label: 'Vidéaste' },
    { icon: '🎧', label: 'DJ' }, { icon: '🎵', label: 'Beatmaker' }, { icon: '🎙️', label: 'Studio' },
];
