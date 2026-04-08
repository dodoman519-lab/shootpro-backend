import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    const close = () => setIsOpen(false);

    const handleLogout = () => {
        // Marquer offline
        if (user) fetch(`${API_URL}/users/${user.id}/offline`, { method: 'POST' }).catch(() => { });
        logout();
        close();
        navigate('/');
    };

    // Ping online + polling notifications
    useEffect(() => {
        if (!user) return;
        // Marquer en ligne
        fetch(`${API_URL}/users/${user.id}/online`, { method: 'POST' }).catch(() => { });

        // Charger notifications non lues
        const fetchNotifs = () => {
            fetch(`${API_URL}/notifications/${user.id}`)
                .then(r => r.json())
                .then((notifs: any[]) => setUnreadCount(Array.isArray(notifs) ? notifs.filter(n => !n.isRead).length : 0))
                .catch(() => { });
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000); // Poll toutes les 30s

        // Marquer offline au déchargement de la page
        const handleUnload = () => { fetch(`${API_URL}/users/${user.id}/offline`, { method: 'POST', keepalive: true }).catch(() => { }); };
        window.addEventListener('beforeunload', handleUnload);

        return () => { clearInterval(interval); window.removeEventListener('beforeunload', handleUnload); };
    }, [user]);

    const markAllRead = () => {
        if (!user) return;
        fetch(`${API_URL}/notifications/read-all/${user.id}`, { method: 'PATCH' }).then(() => setUnreadCount(0)).catch(() => { });
    };

    return (
        <>
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 28px',
                background: 'rgba(0, 0, 0, 0.96)',
                borderBottom: '1px solid rgba(193, 120, 79, 0.15)',
                backdropFilter: 'blur(12px)',
            }}>
                {/* Logo */}
                <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="ShootPro" style={{ height: 52, objectFit: 'contain', borderRadius: 12, boxShadow: '0 0 16px rgba(193,120,79,0.3)' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
                </Link>

                {/* Centre — liens rapides */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <NavLink to="/explore" label="Trouver un Pro" onClick={close} />
                    <NavLink to="/stagiaires" label="Stagiaires" onClick={close} />
                    {user && <NavLink to="/contracts" label="Contrats" onClick={close} />}
                    {user?.role === 'PRO' && <NavLink to="/agenda" label="Mon Agenda" onClick={close} />}
                </div>

                {/* Droite */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {!user ? (
                        <>
                            <Link to="/login" onClick={close} style={{ color: '#C0C0C8', textDecoration: 'none', fontSize: 14, padding: '8px 14px' }}>Connexion</Link>
                            <Link to="/register" onClick={close}>
                                <button className="btn-gold" style={{ padding: '8px 18px', fontSize: 13 }}>S'inscrire</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Badge notifications */}
                            <Link to="/account" onClick={() => { markAllRead(); close(); }} style={{ position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                                title={unreadCount > 0 ? `${unreadCount} message(s) non lu(s)` : 'Messagerie'}>
                                <span style={{ fontSize: 18 }}>💬</span>
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: -4, right: -4, background: '#e74c3c', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000' }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            {/* Avatar + menu */}
                            <div style={{ position: 'relative' }}>
                                <button onClick={() => setIsOpen(!isOpen)} style={{
                                    background: 'rgba(193,120,79,0.15)', border: '1px solid rgba(193,120,79,0.3)',
                                    borderRadius: '50%', width: 40, height: 40, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#C1784F', fontSize: 16, fontWeight: 700
                                }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </button>

                                {isOpen && (
                                    <div style={{
                                        position: 'absolute', top: '50px', right: 0, minWidth: '240px',
                                        background: '#0e0e12', border: '1px solid rgba(193,120,79,0.2)',
                                        borderRadius: 12, padding: '8px 0', boxShadow: '0 16px 40px rgba(0,0,0,0.8)'
                                    }}>
                                        {/* Info utilisateur */}
                                        <div style={{ padding: '12px 20px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', display: 'inline-block' }} />
                                                <div style={{ fontWeight: 700, fontSize: 15, color: '#F8E5BA' }}>{user.name}</div>
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                                                {user.role === 'PRO' ? '🎨 Professionnel' : user.role === 'ADMIN' ? '🔐 Admin' : '👤 Client'}
                                            </div>
                                        </div>

                                        <MenuGroup label="Mon Espace" />
                                        <MenuItem to="/account" label="👤 Mon Compte" onClick={close} />
                                        <MenuItem to="/contracts" label="📄 Mes Contrats" onClick={close} />
                                        {user.role === 'PRO' && <MenuItem to="/agenda" label="📅 Mon Agenda" onClick={close} />}
                                        {user.role === 'PRO' && <MenuItem to="/pro-hub" label="🤝 Hub Pro" onClick={close} />}

                                        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 16px' }} />
                                        <MenuGroup label="Navigation" />
                                        <MenuItem to="/" label="🏠 Accueil" onClick={close} />
                                        <MenuItem to="/explore" label="🔍 Trouver un Créateur" onClick={close} />
                                        <MenuItem to="/stagiaires" label="🎓 Stages" onClick={close} />

                                        {user.role === 'ADMIN' && (
                                            <>
                                                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 16px' }} />
                                                <MenuItem to="/admin" label="🔐 Admin Dashboard" onClick={close} />
                                            </>
                                        )}

                                        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 16px' }} />
                                        <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '11px 20px', background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                            🚪 Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Burger pour mobile / non-connecté */}
                    {!user && (
                        <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {[0, 1, 2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, background: '#C1784F' }} />)}
                        </button>
                    )}
                </div>
            </nav>
            {isOpen && <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />}
        </>
    );
};

const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
    <Link to={to} onClick={onClick} style={{ color: '#C0C0C8', textDecoration: 'none', fontSize: 13, padding: '8px 14px', borderRadius: 6, fontWeight: 500, transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#C1784F'}
        onMouseLeave={e => e.currentTarget.style.color = '#C0C0C8'}
    >{label}</Link>
);

const MenuGroup = ({ label }: { label: string }) => (
    <div style={{ padding: '4px 20px 2px', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: '#444', fontWeight: 600 }}>{label}</div>
);

const MenuItem = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
    <Link to={to} onClick={onClick} style={{ display: 'block', padding: '10px 20px', color: '#DDD', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(193,120,79,0.08)'; e.currentTarget.style.color = '#C1784F'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#DDD'; }}
    >{label}</Link>
);
