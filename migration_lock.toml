import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Créer 2 utilisateurs pros et 2 clients de test
    const client1 = await prisma.user.create({
        data: {
            email: "client1@test.com",
            password: "password",
            name: "Sophie Leroy",
            role: "CLIENT",
        },
    });

    const client2 = await prisma.user.create({
        data: {
            email: "client2@test.com",
            password: "password",
            name: "Marc Dupont",
            role: "CLIENT",
        },
    });

    const pro1 = await prisma.user.create({
        data: {
            email: "pro1@test.com",
            password: "password",
            name: "Alex Morand",
            role: "PRO",
            proProfile: {
                create: {
                    level: "EXPERT",
                    types: JSON.stringify(["PHOTOGRAPHER", "VIDEOGRAPHER"]),
                    bio: "Photographe et vidéaste professionnel basé à Paris, spécialisé dans les shootings urbains et les clips musicaux.",
                    city: "Paris",
                    region: "Île-de-France",
                    isCertified: true,
                    avgRating: 4.8,
                    likesCount: 142,
                    services: {
                        create: [
                            { name: "Shooting portrait", basePrice: 150 },
                            { name: "Clip musical", basePrice: 800 },
                            { name: "Reportage événement", basePrice: 400 },
                        ],
                    },
                },
            },
        },
        include: { proProfile: true },
    });

    const pro2 = await prisma.user.create({
        data: {
            email: "pro2@test.com",
            password: "password",
            name: "Djibril Kane",
            role: "PRO",
            proProfile: {
                create: {
                    level: "INTERMEDIATE",
                    types: JSON.stringify(["DJ", "BEATMAKER"]),
                    bio: "DJ et producteur de musique depuis 10 ans. Spécialisé dans l'électro, le hip-hop et l'afrobeats.",
                    city: "Lyon",
                    region: "Auvergne-Rhône-Alpes",
                    isCertified: false,
                    avgRating: 4.2,
                    likesCount: 87,
                    services: {
                        create: [
                            { name: "Set DJ soirée privée", basePrice: 300 },
                            { name: "Prod beat sur mesure", basePrice: 200 },
                        ],
                    },
                },
            },
        },
        include: { proProfile: true },
    });

    // Ajouter des avis
    if (pro1.proProfile) {
        await prisma.review.create({
            data: {
                proProfileId: pro1.proProfile.id,
                authorId: client1.id,
                rating: 5,
                comment: "Incroyable expérience ! Alex est très professionnel et les photos sont magnifiques.",
            },
        });
        await prisma.review.create({
            data: {
                proProfileId: pro1.proProfile.id,
                authorId: client2.id,
                rating: 5,
                comment: "Top qualité, je recommande vivement !",
            },
        });
    }

    if (pro2.proProfile) {
        await prisma.review.create({
            data: {
                proProfileId: pro2.proProfile.id,
                authorId: client1.id,
                rating: 4,
                comment: "Super ambiance garantie, très à l'écoute.",
            },
        });
    }

    console.log("✅ Base de données remplie avec des données de test !");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
