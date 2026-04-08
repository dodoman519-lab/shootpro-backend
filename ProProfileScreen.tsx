import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ARTICLES = [
    {
        num: '1', title: "Objet du service",
        content: `ShootPro est une plateforme numérique permettant la mise en relation entre des clients (particuliers ou entreprises) et des professionnels de la création visuelle et sonore (photographes, vidéastes, DJ, beatmakers, studios, etc.).

ShootPro n'est pas un prestataire de services : la plateforme se limite à faciliter le contact entre les utilisateurs.`
    },
    {
        num: '2', title: "Inscription et utilisation du service",
        content: `L'accès à la plateforme implique l'acceptation pleine et entière des présentes CGU.
Les utilisateurs s'engagent à fournir des informations exactes lors de leur inscription et à ne pas usurper l'identité d'un tiers.`
    },
    {
        num: '3', title: "Collecte et traitement des données",
        content: `ShootPro collecte certaines données personnelles (localisation, préférences, interactions, informations de profil) dans le but :
• d'améliorer la qualité du service,
• d'optimiser la mise en relation,
• d'assurer la sécurité de la plateforme,
• d'analyser l'utilisation du site pour proposer une meilleure expérience.

Les données sont traitées conformément aux lois applicables en matière de protection des données.`
    },
    {
        num: '4', title: "Rôle de ShootPro et limitation de responsabilité",
        content: `ShootPro agit uniquement comme intermédiaire.
La plateforme :
• ne garantit pas la qualité des prestations fournies par les professionnels,
• n'intervient pas dans les transactions, paiements ou contrats conclus entre utilisateurs,
• ne peut être tenue responsable des retards, annulations, litiges, pertes, dommages ou préjudices causés par un professionnel ou un client.

En cas de problème, les parties doivent régler leur différend directement entre elles.`
    },
    {
        num: '5', title: "Certification des professionnels",
        content: `ShootPro met en place un système de certification visant à vérifier l'identité, l'activité ou la fiabilité des professionnels.
Cependant :
• la certification n'est pas une garantie absolue,
• certains professionnels peuvent passer au travers des vérifications malgré les efforts de ShootPro,
• ShootPro ne peut être tenu responsable des comportements, manquements, fraudes ou négligences d'un professionnel, qu'il soit certifié ou non.

Les utilisateurs restent responsables de vérifier la pertinence et la qualité du professionnel qu'ils choisissent.`
    },
    {
        num: '6', title: "Contenus publiés par les utilisateurs",
        content: `Les utilisateurs sont responsables des contenus qu'ils publient (photos, descriptions, avis, messages).
Tout contenu illégal, diffamatoire, discriminatoire ou portant atteinte aux droits d'autrui pourra être supprimé sans préavis.`
    },
    {
        num: '7', title: "Sécurité et disponibilité du service",
        content: `ShootPro met tout en œuvre pour assurer la sécurité et la disponibilité du site.
Toutefois, la plateforme ne garantit pas :
• l'absence totale de bugs,
• une disponibilité continue du service,
• la compatibilité avec tous les appareils ou navigateurs.

ShootPro ne pourra être tenu responsable en cas d'interruption, de maintenance ou de dysfonctionnement.`
    },
    {
        num: '8', title: "Suspension ou suppression de compte",
        content: `ShootPro se réserve le droit de suspendre ou supprimer un compte en cas :
• de non-respect des CGU,
• d'utilisation frauduleuse,
• de comportement abusif ou dangereux,
• de publication de contenus interdits.`
    },
    {
        num: '9', title: "Modification des CGU",
        content: `ShootPro peut modifier les présentes CGU à tout moment.
Les utilisateurs seront informés en cas de changement important.`
    },
    {
        num: '10', title: "Acceptation des CGU",
        content: `L'utilisation de ShootPro implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation.`
    },
];

export const CguPage = () => {
    const [open, setOpen] = useState<string | null>(null);

    return (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
            <div className="fade-in" style={{ marginBottom: 40, textAlign: 'center' }}>
                <span className="badge-copper" style={{ marginBottom: 12, display: 'inline-block' }}>Juridique</span>
                <h1 style={{ fontSize: 44, marginBottom: 8 }}>Conditions Générales d'Utilisation</h1>
                <div className="accent-line" style={{ margin: '16px auto' }} />
                <p style={{ color: '#666', fontSize: 14 }}>Dernière mise à jour : Mars 2025 — L'utilisation de ShootPro implique l'acceptation de ces conditions.</p>
            </div>

            {/* Bandeau d'info */}
            <div style={{ background: 'rgba(193,120,79,0.1)', border: '1px solid rgba(193,120,79,0.3)', borderRadius: 12, padding: '16px 24px', marginBottom: 36, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24 }}>⚖️</span>
                <div>
                    <div style={{ fontWeight: 700, color: '#C1784F', marginBottom: 4 }}>Pourquoi ces CGU ?</div>
                    <p style={{ fontSize: 14, color: '#888', margin: 0, lineHeight: 1.6 }}>
                        Ces conditions définissent les règles d'utilisation de ShootPro. En créant un compte, vous reconnaissez les avoir lues et acceptées. Elles protègent à la fois les utilisateurs et la plateforme.
                    </p>
                </div>
            </div>

            {/* Articles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ARTICLES.map(art => (
                    <div
                        key={art.num}
                        className="glass-panel"
                        style={{ overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }}
                    >
                        <div
                            onClick={() => setOpen(open === art.num ? null : art.num)}
                            style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
                        >
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ background: 'linear-gradient(135deg, #C1784F, #D4AF37)', color: '#000', fontWeight: 700, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                                    {art.num}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: 16, color: '#F8E5BA' }}>Article {art.num} — {art.title}</span>
                            </div>
                            <span style={{ color: '#C1784F', fontSize: 20, transition: 'transform 0.3s', transform: open === art.num ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                        </div>
                        {open === art.num && (
                            <div style={{ padding: '0 24px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.8, marginTop: 16, whiteSpace: 'pre-line' }}>
                                    {art.content}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bouton inscription */}
            <div style={{ textAlign: 'center', marginTop: 48, padding: '32px', background: 'rgba(193,120,79,0.05)', borderRadius: 16, border: '1px solid rgba(193,120,79,0.15)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                <h2 style={{ fontSize: 22, marginBottom: 8 }}>Prêt à rejoindre ShootPro ?</h2>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>En créant votre compte, vous acceptez l'intégralité de ces conditions.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/register" className="btn-gold" style={{ padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }}>
                        Créer mon compte
                    </Link>
                    <Link to="/" className="btn-outline" style={{ padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }}>
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};
