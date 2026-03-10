import React, { useEffect, useState } from 'react';
import API_URL from '../config/api';

type Internship = {
    id: string; title: string; description: string;
    city: string; region: string; department?: string;
    startDate: string; endDate: string;
    authorName: string; authorAge?: number;
    conventionFileName?: string; reportFileName?: string;
    createdAt: string;
};

const diffDays = (start: string, end: string) => {
    const s = new Date(start), e = new Date(end);
    return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
};

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
});

export const StagiairesPage = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', city: '', region: '', department: '', startDate: '', endDate: '', authorName: '', authorAge: '' });
    const [conventionFile, setConventionFile] = useState<File | null>(null);
    const [reportFile, setReportFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { load(); }, []);

    const load = () => {
        fetch(`${API_URL}/internships`).then(r => r.json()).then(setInternships).catch(console.error);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') setter(f);
        else if (f) alert('Seuls les fichiers PDF sont acceptés.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let conventionPdf = undefined, conventionFileName = undefined;
            let reportPdf = undefined, reportFileName = undefined;
            if (conventionFile) { conventionPdf = await fileToBase64(conventionFile); conventionFileName = conventionFile.name; }
            if (reportFile) { reportPdf = await fileToBase64(reportFile); reportFileName = reportFile.name; }

            const res = await fetch(`${API_URL}/internships`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, authorAge: form.authorAge ? Number(form.authorAge) : undefined, conventionPdf, conventionFileName, reportPdf, reportFileName })
            });
            if (res.ok) {
                load();
                setShowForm(false);
                setForm({ title: '', description: '', city: '', region: '', department: '', startDate: '', endDate: '', authorName: '', authorAge: '' });
                setConventionFile(null);
                setReportFile(null);
            } else { alert('Erreur lors de la soumission.'); }
        } catch { alert('Erreur lors de l\'envoi.'); }
        setSubmitting(false);
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }}>
            <div className="fade-in" style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <span className="badge-copper" style={{ marginBottom: 12, display: 'inline-block' }}>Espace Stagiaires</span>
                    <h1 style={{ fontSize: 40 }}>Offres de Stage</h1>
                    <div className="accent-line" />
                    <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>Déposez votre annonce avec vos documents PDF. Les professionnels de votre région pourront vous contacter.</p>
                </div>
                <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Fermer' : '📋 Déposer une annonce'}
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="glass-panel fade-in" style={{ padding: 28, marginBottom: 32, borderLeft: '3px solid #C1784F' }}>
                    <h2 style={{ fontSize: 22, marginBottom: 20 }}>Mon annonce de stage</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={lbl}>Titre du stage *</label>
                            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%' }} placeholder="Stage en photographie événementielle" />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={lbl}>Description / Objectifs *</label>
                            <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', resize: 'vertical' }} placeholder="Décrivez vos compétences et ce que vous recherchez..." />
                        </div>
                        <div>
                            <label style={lbl}>Prénom / Nom *</label>
                            <input required value={form.authorName} onChange={e => setForm({ ...form, authorName: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={lbl}>Âge</label>
                            <input type="number" min="14" max="35" value={form.authorAge} onChange={e => setForm({ ...form, authorAge: e.target.value })} style={{ width: '100%' }} placeholder="18" />
                        </div>
                        <div>
                            <label style={lbl}>Ville *</label>
                            <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={lbl}>Département</label>
                            <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ width: '100%' }} placeholder="75, 69, 13..." />
                        </div>
                        <div>
                            <label style={lbl}>Région *</label>
                            <input required value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div />
                        <div>
                            <label style={lbl}>Date de début *</label>
                            <input required type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={lbl}>Date de fin *</label>
                            <input required type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        {form.startDate && form.endDate && (
                            <div style={{ gridColumn: '1/-1', padding: '10px 14px', background: 'rgba(193,120,79,0.07)', borderRadius: 8, fontSize: 14, color: '#C1784F', fontWeight: 600 }}>
                                ⏱ Durée : {diffDays(form.startDate, form.endDate)} jours ({Math.round(diffDays(form.startDate, form.endDate) / 7)} semaines)
                            </div>
                        )}

                        {/* Upload PDF Convention */}
                        <div>
                            <label style={lbl}>Convention de stage (PDF)</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', border: '1px dashed rgba(193,120,79,0.3)', borderRadius: 8, color: conventionFile ? '#C1784F' : '#555', fontSize: 13 }}>
                                <span style={{ fontSize: 20 }}>📎</span>
                                {conventionFile ? `✅ ${conventionFile.name}` : 'Cliquez pour choisir un fichier PDF'}
                                <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => handleFile(e, setConventionFile)} />
                            </label>
                        </div>

                        {/* Upload PDF Rapport */}
                        <div>
                            <label style={lbl}>Rapport de stage (PDF)</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', border: '1px dashed rgba(193,120,79,0.3)', borderRadius: 8, color: reportFile ? '#C1784F' : '#555', fontSize: 13 }}>
                                <span style={{ fontSize: 20 }}>📄</span>
                                {reportFile ? `✅ ${reportFile.name}` : 'Cliquez pour choisir un fichier PDF'}
                                <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => handleFile(e, setReportFile)} />
                            </label>
                        </div>

                        <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Annuler</button>
                            <button type="submit" className="btn-gold" disabled={submitting}>{submitting ? 'Envoi…' : 'Publier mon annonce'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des annonces */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {internships.length === 0 && (
                    <div style={{ padding: 48, textAlign: 'center', color: '#555' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
                        <p>Aucune annonce publiée pour le moment.</p>
                        <button className="btn-gold" style={{ marginTop: 20 }} onClick={() => setShowForm(true)}>Déposer la première annonce</button>
                    </div>
                )}
                {internships.map(intern => {
                    const duration = diffDays(intern.startDate, intern.endDate);
                    return (
                        <div key={intern.id} className="glass-panel" style={{ padding: 28, borderLeft: '3px solid rgba(193,120,79,0.4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                                <div>
                                    <h3 style={{ fontSize: 20, color: '#F8E5BA', marginBottom: 6 }}>{intern.title}</h3>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <span className="badge-copper">{intern.authorName}{intern.authorAge ? `, ${intern.authorAge} ans` : ''}</span>
                                        <span className="badge-navy">📍 {intern.city}{intern.department ? ` (${intern.department})` : ''}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#C1784F', fontWeight: 700, fontFamily: 'Playfair Display', fontSize: 18 }}>⏱ {duration} jours</div>
                                    <div style={{ fontSize: 12, color: '#666' }}>
                                        {new Date(intern.startDate).toLocaleDateString('fr-FR')} → {new Date(intern.endDate).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: '#999', lineHeight: 1.7, fontSize: 14, marginBottom: 14 }}>{intern.description}</p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {intern.conventionFileName && (
                                    <span style={{ padding: '6px 14px', background: 'rgba(193,120,79,0.1)', border: '1px solid rgba(193,120,79,0.25)', borderRadius: 8, fontSize: 13, color: '#C1784F' }}>
                                        📎 {intern.conventionFileName}
                                    </span>
                                )}
                                {intern.reportFileName && (
                                    <span style={{ padding: '6px 14px', background: 'rgba(27,42,74,0.15)', border: '1px solid rgba(27,42,74,0.3)', borderRadius: 8, fontSize: 13, color: '#B8BCC8' }}>
                                        📄 {intern.reportFileName}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const lbl: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 12, color: '#666' };
