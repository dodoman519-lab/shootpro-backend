import React, { useEffect, useState } from "react";
import API_URL from '../config/api';

type ProDetails = {
    id: string;
    isCertified: boolean;
    city: string;
    region: string;
    level: string;
    user: { name: string };
    portfolioItems: { id: string; imageUrl: string }[];
    services: { id: string; name: string; basePrice: number }[];
    reviews: { id: string; rating: number; comment: string; author: { name: string } }[];
};

export const ProProfileScreen = ({ proId }: { proId: string }) => {
    const [pro, setPro] = useState<ProDetails | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/pros/${proId}`)
            .then(r => r.json())
            .then(setPro)
            .catch(console.error);
    }, [proId]);

    if (!pro) return <div style={{ padding: 20, color: "white" }}>Chargement...</div>;

    return (
        <div style={{ padding: 24, background: "#050509", minHeight: "100vh", color: "white" }}>
            <h1 style={{ fontSize: 32 }}>{pro.user.name}</h1>

            {pro.isCertified && (
                <div style={{ background: "#00d47e", color: "black", padding: "6px 12px", borderRadius: 8, width: "fit-content", fontWeight: 600, marginBottom: 16 }}>
                    ✔ Créateur certifié ShootPro
                </div>
            )}

            <p style={{ opacity: 0.8 }}>{pro.city}, {pro.region}</p>
            <p style={{ opacity: 0.8 }}>Niveau : {pro.level}</p>

            <h2 style={{ marginTop: 32, marginBottom: 16 }}>Portfolio</h2>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16 }}>
                {pro.portfolioItems.length > 0 ? pro.portfolioItems.map(item => (
                    <img key={item.id} src={item.imageUrl} alt="Portfolio" style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover", backgroundColor: "#111" }} />
                )) : <div style={{ opacity: 0.5 }}>Aucun élément dans le portfolio</div>}
            </div>

            <h2 style={{ marginTop: 32, marginBottom: 16 }}>Tarifs indicatifs</h2>
            <div style={{ display: "grid", gap: 8 }}>
                {pro.services.length > 0 ? pro.services.map(s => (
                    <div key={s.id} style={{ background: "#111", padding: 12, borderRadius: 8 }}>
                        <strong style={{ color: "#f5b014" }}>{s.name}</strong> — à partir de {s.basePrice} €
                    </div>
                )) : <div style={{ opacity: 0.5 }}>Aucun service renseigné</div>}
            </div>

            <h2 style={{ marginTop: 32, marginBottom: 16 }}>Avis</h2>
            <div style={{ display: "grid", gap: 12 }}>
                {pro.reviews.length > 0 ? pro.reviews.map(r => (
                    <div key={r.id} style={{ background: "#111", padding: 16, borderRadius: 8 }}>
                        <div style={{ marginBottom: 4 }}>
                            ⭐ <strong style={{ color: "#f5b014" }}>{r.rating}/5</strong> — par {r.author.name}
                        </div>
                        {r.comment && <div style={{ opacity: 0.8, marginTop: 8 }}>"{r.comment}"</div>}
                    </div>
                )) : <div style={{ opacity: 0.5 }}>Aucun avis pour le moment</div>}
            </div>

            <button
                style={{
                    marginTop: 32,
                    padding: "14px 24px",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #f5b014, #ff8a00)",
                    color: "#050509",
                    border: "none",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(245, 176, 20, 0.3)"
                }}
                onClick={() => alert("Ouvrir le chat")}
            >
                Contacter le créateur
            </button>
        </div>
    );
};
