import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

type Slot = {
    id: string;
    date: string;
    startTime?: string;
    endTime?: string;
    label?: string;
    isBooked: boolean;
    bookings: any[];
};

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export const AgendaPage = () => {
    const { user } = useAuth();
    const [proProfileId, setProProfileId] = useState<string | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [slotForm, setSlotForm] = useState({ startTime: '', endTime: '', label: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'PRO') { setLoading(false); return; }
        fetch(`${API_URL}/users/${user.id}`)
            .then(r => r.json())
            .then(data => {
                if (data.proProfile) { setProProfileId(data.proProfile.id); loadSlots(data.proProfile.id); }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user]);

    const loadSlots = useCallback((id: string) => {
        fetch(`${API_URL}/pros/${id}/availability`)
            .then(r => r.json())
            .then(setSlots)
            .catch(console.error);
    }, []);

    const slotForDate = (dateStr: string) => slots.find(s => s.date === dateStr);

    const handleDayClick = (dateStr: string) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const clicked = new Date(dateStr + 'T12:00:00'); clicked.setHours(0, 0, 0, 0);
        if (clicked < today) return;
        const existing = slotForDate(dateStr);
        if (existing) { if (!existing.isBooked) deleteSlot(existing.id); return; }
        setSelectedDay(dateStr);
        setSlotForm({ startTime: '', endTime: '', label: '' });
        setModalOpen(true);
    };

    const addSlot = async () => {
        if (!proProfileId || !selectedDay) return;
        setSaving(true);
        try {
            await fetch(`${API_URL}/pros/${proProfileId}/availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDay, ...slotForm })
            });
            loadSlots(proProfileId);
            setModalOpen(false);
        } catch { alert('Erreur ajout créneau'); }
        setSaving(false);
    };

    const deleteSlot = async (slotId: string) => {
        if (!proProfileId) return;
        if (!confirm('Supprimer ce créneau disponible ?')) return;
        await fetch(`${API_URL}/pros/${proProfileId}/availability/${slotId}`, { method: 'DELETE' });
        loadSlots(proProfileId);
    };

    // Build calendar grid
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Start on Monday (0=Mon)
    let startDow = firstDay.getDay() - 1; if (startDow < 0) startDow = 6;
    const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;
    const cells: (Date | null)[] = [];
    for (let i = 0; i < totalCells; i++) {
        const dayNum = i - startDow + 1;
        if (dayNum < 1 || dayNum > lastDay.getDate()) cells.push(null);
        else cells.push(new Date(year, month, dayNum));
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);

    const getDayStatus = (date: Date): 'past' | 'available' | 'booked' | 'free' => {
        const d = new Date(date); d.setHours(0, 0, 0, 0);
        if (d < today) return 'past';
        const dateStr = date.toISOString().split('T')[0];
        const slot = slotForDate(dateStr);
        if (!slot) return 'free';
        return slot.isBooked ? 'booked' : 'available';
    };

    const statusStyle: Record<string, React.CSSProperties> = {
        past: { background: 'rgba(255,255,255,0.02)', color: '#333', cursor: 'not-allowed' },
        free: { background: 'rgba(255,255,255,0.04)', color: '#666', cursor: 'pointer' },
        available: { background: 'rgba(76,175,80,0.2)', border: '1px solid rgba(76,175,80,0.5)', color: '#4CAF50', cursor: 'pointer', fontWeight: 700 },
        booked: { background: 'rgba(193,120,79,0.15)', border: '1px solid rgba(193,120,79,0.4)', color: '#C1784F', cursor: 'default', fontWeight: 700 },
    };

    if (!user) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Connectez-vous pour gérer votre agenda.<br /><a href="/login" style={{ color: '#C1784F' }}>Se connecter</a></div>;
    if (user.role !== 'PRO') return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Cet espace est réservé aux professionnels.</div>;
    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>;

    const availCount = slots.filter(s => !s.isBooked).length;
    const bookedCount = slots.filter(s => s.isBooked).length;

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
            <div className="fade-in" style={{ marginBottom: 32 }}>
                <span className="badge-copper" style={{ marginBottom: 12, display: 'inline-block' }}>Mon Agenda</span>
                <h1 style={{ fontSize: 40 }}>Calendrier de Disponibilités</h1>
                <div className="accent-line" />
                <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>
                    Cliquez sur un jour pour le marquer disponible · Cliquez à nouveau pour le retirer · Les jours réservés sont affichés en orange.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center', flex: '1 1 140px' }}>
                    <span style={{ fontSize: 24 }}>🟢</span>
                    <div><div style={{ fontSize: 22, fontWeight: 700, color: '#4CAF50' }}>{availCount}</div><div style={{ fontSize: 12, color: '#666' }}>Disponibles</div></div>
                </div>
                <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center', flex: '1 1 140px' }}>
                    <span style={{ fontSize: 24 }}>🔶</span>
                    <div><div style={{ fontSize: 22, fontWeight: 700, color: '#C1784F' }}>{bookedCount}</div><div style={{ fontSize: 12, color: '#666' }}>Réservés</div></div>
                </div>
                <div className="glass-panel" style={{ padding: '14px 20px', fontSize: 13, color: '#555', flex: '2 1 200px', lineHeight: 1.7 }}>
                    <span style={{ color: '#4CAF50' }}>■</span> Disponible &nbsp;
                    <span style={{ color: '#C1784F' }}>■</span> Réservé &nbsp;
                    <span style={{ color: '#444' }}>■</span> Passé
                </div>
            </div>

            {/* Calendrier */}
            <div className="glass-panel" style={{ padding: 24, marginBottom: 24 }}>
                {/* Navigation mois */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#F8E5BA', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>‹</button>
                    <h2 style={{ fontSize: 22, fontFamily: 'Playfair Display', color: '#F8E5BA' }}>{MONTHS[month]} {year}</h2>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#F8E5BA', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>›</button>
                </div>

                {/* Jours de la semaine */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                    {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 12, color: '#555', padding: '6px 0', fontWeight: 600 }}>{d}</div>)}
                </div>

                {/* Cellules */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                    {cells.map((date, i) => {
                        if (!date) return <div key={i} style={{ minHeight: 52 }} />;
                        const dateStr = date.toISOString().split('T')[0];
                        const status = getDayStatus(date);
                        const slot = slotForDate(dateStr);
                        const isToday = new Date(date).setHours(0, 0, 0, 0) === today.getTime();
                        return (
                            <div
                                key={i}
                                onClick={() => handleDayClick(dateStr)}
                                style={{
                                    minHeight: 52, borderRadius: 8, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', padding: 4,
                                    transition: 'all 0.15s',
                                    outline: isToday ? '2px solid rgba(193,120,79,0.6)' : 'none',
                                    ...statusStyle[status],
                                }}
                                title={slot ? (slot.isBooked ? 'Réservé' : `Disponible${slot.startTime ? ` ${slot.startTime}–${slot.endTime}` : ''}`) : 'Cliquer pour marquer disponible'}
                            >
                                <span style={{ fontSize: 14, fontWeight: isToday ? 700 : 400 }}>{date.getDate()}</span>
                                {status === 'available' && <span style={{ fontSize: 9, marginTop: 2 }}>✓ LIBRE</span>}
                                {status === 'booked' && <span style={{ fontSize: 9, marginTop: 2 }}>RÉS.</span>}
                                {slot?.startTime && <span style={{ fontSize: 9, color: '#aaa' }}>{slot.startTime}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Liste des créneaux à venir */}
            {slots.filter(s => !s.isBooked && new Date(s.date) >= today).length > 0 && (
                <div className="glass-panel" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 18, marginBottom: 16 }}>📋 Créneaux disponibles à venir</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {slots.filter(s => !s.isBooked && new Date(s.date) >= today)
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .map(s => (
                                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(76,175,80,0.08)', borderRadius: 8, border: '1px solid rgba(76,175,80,0.2)' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, color: '#F8E5BA' }}>
                                            {new Date(s.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        {s.startTime && <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{s.startTime} – {s.endTime}</span>}
                                        {s.label && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{s.label}</div>}
                                    </div>
                                    <button onClick={() => deleteSlot(s.id)} style={{ background: 'transparent', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>🗑</button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Modal ajout créneau */}
            {modalOpen && selectedDay && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ padding: 32, width: 380, maxWidth: '90vw' }}>
                        <h2 style={{ fontSize: 20, marginBottom: 4 }}>Ajouter une disponibilité</h2>
                        <div style={{ color: '#C1784F', fontWeight: 600, marginBottom: 20 }}>
                            {new Date(selectedDay + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>Heure début (optionnel)</label>
                                    <input type="time" value={slotForm.startTime} onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })} style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>Heure fin (optionnel)</label>
                                    <input type="time" value={slotForm.endTime} onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>Note (optionnel)</label>
                                <input value={slotForm.label} onChange={e => setSlotForm({ ...slotForm, label: e.target.value })} style={{ width: '100%' }} placeholder="Ex: Disponible toute la journée" />
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                <button onClick={addSlot} disabled={saving} className="btn-gold" style={{ flex: 1, padding: '12px' }}>
                                    {saving ? '...' : '✓ Confirmer'}
                                </button>
                                <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#888', borderRadius: 10, cursor: 'pointer' }}>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
