import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ────────────────────────────────────────────
// AUTH
// ────────────────────────────────────────────

// Création compte Admin (route protégée par mot de passe secret)
app.post("/auth/create-admin", async (req, res) => {
  try {
    const { email, password, name, secret } = req.body;
    if (secret !== "shootpro-admin-2026") return res.status(403).json({ error: "Secret invalide" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const updated = await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
      return res.json({ id: updated.id, name: updated.name, role: updated.role, email: updated.email });
    }
    const user = await prisma.user.create({
      data: { email, password, name: name || "Admin", role: "ADMIN" }
    });
    res.json({ id: user.id, name: user.name, role: user.role, email: user.email });
  } catch (e: any) {
    res.status(400).json({ error: "Erreur création admin" });
  }
});

// Inscription Client
app.post("/auth/register-client", async (req, res) => {
  try {
    const { email, password, name, age, department, city, address } = req.body;
    const user = await prisma.user.create({
      data: { email, password, name, role: "CLIENT", age: age ? Number(age) : undefined, department, city, address }
    });
    res.json({ id: user.id, name: user.name, role: user.role, email: user.email });
  } catch (e: any) {
    if (e.code === "P2002") return res.status(400).json({ error: "Email déjà utilisé" });
    res.status(400).json({ error: "Erreur inscription" });
  }
});

// Inscription Pro
app.post("/auth/register-pro", async (req, res) => {
  try {
    const { email, password, name, level, types, city, region, department, websiteUrl, siret, age } = req.body;
    const user = await prisma.user.create({
      data: {
        email, password, name, role: "PRO", age: age ? Number(age) : undefined, department, city,
        proProfile: {
          create: { level: level || "BEGINNER", types: JSON.stringify(types || []), city: city || "", region: region || "", department, websiteUrl, siret }
        }
      },
      include: { proProfile: true }
    });
    res.json({ id: user.id, name: user.name, role: user.role, email: user.email });
  } catch (e: any) {
    if (e.code === "P2002") return res.status(400).json({ error: "Email déjà utilisé" });
    res.status(400).json({ error: "Erreur inscription pro" });
  }
});

// Connexion
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }, include: { proProfile: true } });
    if (!user || user.password !== password) return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    res.json({ id: user.id, name: user.name, role: user.role, email: user.email, proProfileId: user.proProfile?.id });
  } catch (e) {
    res.status(400).json({ error: "Erreur connexion" });
  }
});

// ────────────────────────────────────────────
// PROS
// ────────────────────────────────────────────

app.get("/pros", async (req, res) => {
  try {
    const { city, region, type, specialty, level, sort, department } = req.query;
    const where: any = {};
    if (city) where.city = { contains: String(city) };
    if (region) where.region = { contains: String(region) };
    if (department) where.department = { contains: String(department) };
    if (type) where.types = { contains: String(type) };
    if (specialty) where.specialties = { contains: String(specialty) };
    if (level) where.level = String(level);

    const orderBy: any = sort === "rating" ? { avgRating: "desc" } : sort === "likes" ? { likesCount: "desc" } : { createdAt: "desc" };

    const pros = await prisma.proProfile.findMany({
      where, orderBy,
      include: { user: true, services: true, portfolioItems: true }
    });
    res.json(pros);
  } catch (e) { console.error(e); res.status(400).json({ error: "Erreur recherche" }); }
});

app.post("/pros/:id/like", async (req, res) => {
  try {
    const pro = await prisma.proProfile.update({ where: { id: req.params.id }, data: { likesCount: { increment: 1 } } });
    res.json(pro);
  } catch (e) { res.status(400).json({ error: "Erreur like" }); }
});

app.get("/pros/:id", async (req, res) => {
  try {
    const pro = await prisma.proProfile.update({
      where: { id: req.params.id },
      data: { profileViews: { increment: 1 } },
      include: { user: true, portfolioItems: true, services: true, reviews: { include: { author: true }, orderBy: { createdAt: "desc" } }, availability: { orderBy: { date: "asc" } } }
    });
    res.json(pro);
  } catch (e) { console.error(e); res.status(400).json({ error: "Erreur récupération profil" }); }
});

// Géolocalisation (Haversine)
app.get("/pros/near", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const pros = await prisma.$queryRaw`
      SELECT *, (6371 * acos(cos(radians(${Number(lat)})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${Number(lng)})) + sin(radians(${Number(lat)})) * sin(radians(latitude)))) AS distance
      FROM "ProProfile" WHERE (6371 * acos(cos(radians(${Number(lat)})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${Number(lng)})) + sin(radians(${Number(lat)})) * sin(radians(latitude)))) < ${Number(radius)} ORDER BY distance ASC;
    `;
    res.json(pros);
  } catch (e) { res.status(400).json({ error: "Erreur géolocalisation" }); }
});

// ────────────────────────────────────────────
// USERS / COMPTE
// ────────────────────────────────────────────

app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, include: { proProfile: true } });
    res.json(user);
  } catch (e) { res.status(400).json({ error: "Erreur récupération utilisateur" }); }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, region, department, bio, websiteUrl, types, specialties, avatarUrl, photoUrl1, photoUrl2, photoUrl3, videoUrl1, videoUrl2, age, priceClip, priceStudio, priceMix, priceInstrumental, pricePhoto, address, siret } = req.body;

    // Vérifier si l'utilisateur a un profil PRO
    const existingUser = await prisma.user.findUnique({ where: { id }, include: { proProfile: true } });
    const hasProProfile = !!existingUser?.proProfile;

    const updateData: any = {
      name, age: age ? Number(age) : undefined, avatarUrl, department, city, address,
      siret: siret || undefined,
    };

    if (hasProProfile) {
      updateData.proProfile = {
        update: {
          city, department, region, bio, websiteUrl,
          siret: siret || undefined,
          types: types ? JSON.stringify(types) : undefined,
          specialties: specialties ? JSON.stringify(specialties) : undefined,
          photoUrl1, photoUrl2, photoUrl3, videoUrl1, videoUrl2,
          priceClip: priceClip ? Number(priceClip) : undefined,
          priceStudio: priceStudio ? Number(priceStudio) : undefined,
          priceMix: priceMix ? Number(priceMix) : undefined,
          priceInstrumental: priceInstrumental ? Number(priceInstrumental) : undefined,
          pricePhoto: pricePhoto ? Number(pricePhoto) : undefined,
        }
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { proProfile: true }
    });
    res.json(user);
  } catch (e) { console.error(e); res.status(400).json({ error: "Erreur mise à jour compte" }); }
});

// ────────────────────────────────────────────
// ADMIN
// ────────────────────────────────────────────

// Lister tous les utilisateurs (pour l'admin)
app.get("/admin/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { proProfile: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(users);
  } catch (e) { res.status(400).json({ error: "Erreur liste utilisateurs" }); }
});

// Supprimer un compte (accès admin)
app.delete("/admin/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: "Erreur suppression compte" }); }
});

// Aussi accessible via /users/:id
app.delete("/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: "Erreur suppression compte" }); }
});

// Certifier / décertifier un pro
app.patch("/pros/:id/certify", async (req, res) => {
  try {
    const { certified } = req.body;
    const pro = await prisma.proProfile.update({ where: { id: req.params.id }, data: { isCertified: certified } });
    res.json(pro);
  } catch (e) { res.status(400).json({ error: "Erreur certification" }); }
});

app.patch("/admin/pros/:id/certify", async (req, res) => {
  try {
    const { certified } = req.body;
    const pro = await prisma.proProfile.update({ where: { id: req.params.id }, data: { isCertified: certified } });
    res.json(pro);
  } catch (e) { res.status(400).json({ error: "Erreur certification" }); }
});

// Changer le niveau d'un pro
app.patch("/admin/pros/:id/level", async (req, res) => {
  try {
    const { level } = req.body;
    const pro = await prisma.proProfile.update({ where: { id: req.params.id }, data: { level } });
    res.json(pro);
  } catch (e) { res.status(400).json({ error: "Erreur niveau" }); }
});

// Modifier un utilisateur (admin)
app.put("/admin/users/:id", async (req, res) => {
  try {
    const { name, email, role, city } = req.body;
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { name, email, role, city } });
    res.json(user);
  } catch (e) { res.status(400).json({ error: "Erreur modification utilisateur" }); }
});

// ────────────────────────────────────────────
// REVIEWS
// ────────────────────────────────────────────

app.post("/pros/:id/reviews", async (req, res) => {
  try {
    const { authorId, rating, comment } = req.body;
    const review = await prisma.review.create({ data: { proProfileId: req.params.id, authorId, rating, comment } });
    const stats = await prisma.review.aggregate({ where: { proProfileId: req.params.id }, _avg: { rating: true } });
    await prisma.proProfile.update({ where: { id: req.params.id }, data: { avgRating: stats._avg.rating ?? 0 } });
    res.json(review);
  } catch (e) { res.status(400).json({ error: "Erreur avis" }); }
});

// ────────────────────────────────────────────
// MESSAGERIE
// ────────────────────────────────────────────

app.post("/chats", async (req, res) => {
  try {
    const { clientId, proId, firstMessage, senderName } = req.body;
    // Vérifier si une chatroom existe déjà
    const existing = await prisma.chatRoom.findFirst({ where: { clientId, proId } });
    if (existing) {
      if (firstMessage) {
        await prisma.message.create({ data: { chatRoomId: existing.id, senderId: clientId, senderName: senderName || "Vous", content: firstMessage } });
      }
      const room = await prisma.chatRoom.findUnique({ where: { id: existing.id }, include: { messages: { orderBy: { createdAt: "asc" } } } });
      return res.json(room);
    }
    const chat = await prisma.chatRoom.create({
      data: {
        clientId, proId,
        messages: firstMessage ? { create: { senderId: clientId, senderName: senderName || "Vous", content: firstMessage } } : undefined
      },
      include: { messages: true }
    });
    // Notifier le pro de la nouvelle prise de contact
    await prisma.notification.create({
      data: { userId: proId, type: 'MESSAGE', message: `Nouveau message de ${senderName || 'un client'}`, link: '/account' }
    }).catch(() => { });
    res.json(chat);
  } catch (e) { console.error(e); res.status(400).json({ error: "Erreur création chat" }); }
});

app.get("/chats/:chatRoomId/messages", async (req, res) => {
  try {
    const messages = await prisma.message.findMany({ where: { chatRoomId: req.params.chatRoomId }, orderBy: { createdAt: "asc" } });
    res.json(messages);
  } catch (e) { res.status(400).json({ error: "Erreur messages" }); }
});

app.post("/chats/:chatRoomId/messages", async (req, res) => {
  try {
    const { senderId, senderName, content } = req.body;
    const msg = await prisma.message.create({ data: { chatRoomId: req.params.chatRoomId, senderId, senderName: senderName || "Utilisateur", content } });
    // Créer une notification pour le destinataire
    const room = await prisma.chatRoom.findUnique({ where: { id: req.params.chatRoomId } });
    if (room) {
      const recipientId = room.clientId === senderId ? room.proId : room.clientId;
      await prisma.notification.create({ data: { userId: recipientId, type: 'MESSAGE', message: `Nouveau message de ${senderName || 'quelqu\'un'}`, link: '/account' } }).catch(() => { });
    }
    res.json(msg);
  } catch (e) { res.status(400).json({ error: "Erreur envoi message" }); }
});

app.get("/chats/user/:userId", async (req, res) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: { OR: [{ clientId: req.params.userId }, { proId: req.params.userId }] },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 }, client: true, pro: true }
    });
    res.json(rooms);
  } catch (e) { res.status(400).json({ error: "Erreur conversations" }); }
});

// ────────────────────────────────────────────
// CONTRATS
// ────────────────────────────────────────────

app.post("/contracts", async (req, res) => {
  try {
    const { proId, clientId, title, description, address, price, eventDate } = req.body;
    const contract = await prisma.contract.create({ data: { proId, clientId, title, description, address, price: Number(price), eventDate } });
    res.json(contract);
  } catch (e) { console.error(e); res.status(400).json({ error: "Erreur création contrat" }); }
});

app.get("/contracts/user/:userId", async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { OR: [{ proId: req.params.userId }, { clientId: req.params.userId }] },
      include: { pro: true, client: true }, orderBy: { createdAt: "desc" }
    });
    res.json(contracts);
  } catch (e) { res.status(400).json({ error: "Erreur contrats" }); }
});

app.patch("/contracts/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // ACCEPTED | REJECTED
    const contract = await prisma.contract.update({ where: { id: req.params.id }, data: { status } });
    res.json(contract);
  } catch (e) { res.status(400).json({ error: "Erreur mise à jour contrat" }); }
});

app.delete("/contracts/:id", async (req, res) => {
  try {
    await prisma.contract.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(400).json({ error: "Erreur suppression contrat" }); }
});

// ────────────────────────────────────────────
// AGENDA / DISPONIBILITÉS
// ────────────────────────────────────────────

app.post("/pros/:id/availability", async (req, res) => {
  try {
    const { date, label } = req.body;
    const slot = await prisma.availability.create({ data: { proProfileId: req.params.id, date, label } });
    res.json(slot);
  } catch (e) { res.status(400).json({ error: "Erreur ajout disponibilité" }); }
});

app.get("/pros/:id/availability", async (req, res) => {
  try {
    const slots = await prisma.availability.findMany({ where: { proProfileId: req.params.id }, orderBy: { date: "asc" }, include: { bookings: true } });
    res.json(slots);
  } catch (e) { res.status(400).json({ error: "Erreur disponibilités" }); }
});

app.delete("/pros/:proId/availability/:slotId", async (req, res) => {
  try {
    await prisma.availability.delete({ where: { id: req.params.slotId } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: "Erreur suppression créneau" }); }
});

// ————————————————————————————————————————————
// ONLINE STATUS
// ————————————————————————————————————————————

app.post("/users/:id/online", async (req, res) => {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isOnline: true, lastSeen: new Date() } });
    res.json({ ok: true });
  } catch (__) { res.json({ ok: false }); }
});

app.post("/users/:id/offline", async (req, res) => {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isOnline: false, lastSeen: new Date() } });
    res.json({ ok: true });
  } catch (__) { res.json({ ok: false }); }
});

// ————————————————————————————————————————————
// NOTIFICATIONS
// ————————————————————————————————————————————

app.get("/notifications/:userId", async (req, res) => {
  try {
    const notifs = await prisma.notification.findMany({ where: { userId: req.params.userId }, orderBy: { createdAt: 'desc' }, take: 50 });
    res.json(notifs);
  } catch (e) { res.status(400).json({ error: 'Erreur notifications' }); }
});

app.patch("/notifications/:id/read", async (req, res) => {
  try {
    res.json(await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } }));
  } catch (e) { res.status(400).json({ error: 'Erreur lecture notif' }); }
});

app.patch("/notifications/read-all/:userId", async (req, res) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.params.userId, isRead: false }, data: { isRead: true } });
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: 'Erreur' }); }
});

// ────────────────────────────────────────────
// RÉSERVATIONS
// ────────────────────────────────────────────

app.post("/bookings", async (req, res) => {
  try {
    const { clientId, proProfileId, availabilityId, note } = req.body;
    const booking = await prisma.booking.create({ data: { clientId, proProfileId, availabilityId, note } });
    await prisma.availability.update({ where: { id: availabilityId }, data: { isBooked: true } });
    res.json(booking);
  } catch (e) { console.error(e); res.status(400).json({ error: "Erreur réservation" }); }
});

app.get("/bookings/user/:userId", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { clientId: req.params.userId },
      include: { proProfile: { include: { user: true } }, availability: true }, orderBy: { createdAt: "desc" }
    });
    res.json(bookings);
  } catch (e) { res.status(400).json({ error: "Erreur réservations" }); }
});

// ────────────────────────────────────────────
// STAGES
// ────────────────────────────────────────────

app.get("/internships", async (req, res) => {
  try {
    const { region } = req.query;
    const where: any = region ? { region: { contains: String(region) } } : {};
    res.json(await prisma.internship.findMany({ where, orderBy: { createdAt: "desc" } }));
  } catch (e) { res.status(400).json({ error: "Erreur stages" }); }
});

app.post("/internships", async (req, res) => {
  try {
    const { title, description, city, region, department, startDate, endDate, conventionPdf, conventionFileName, reportPdf, reportFileName, authorName, authorAge } = req.body;
    res.json(await prisma.internship.create({ data: { title, description, city, region: region || '', department, startDate, endDate, conventionPdf, conventionFileName, reportPdf, reportFileName, authorName, authorAge: authorAge ? Number(authorAge) : undefined } }));
  } catch (e) { res.status(400).json({ error: "Erreur création stage" }); }
});

app.delete("/internships/:id", async (req, res) => {
  try {
    await prisma.internship.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: "Erreur suppression stage" }); }
});

// ────────────────────────────────────────────
// MATÉRIEL
// ────────────────────────────────────────────

app.get("/gear", async (req, res) => {
  try {
    const { city, region } = req.query;
    const where: any = {};
    if (city) where.city = String(city);
    if (region) where.region = String(region);
    res.json(await prisma.gearListing.findMany({ where, include: { owner: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: 'desc' } }));
  } catch (e) { res.status(400).json({ error: "Erreur matériel" }); }
});

app.post("/gear", async (req, res) => {
  try {
    const { ownerId, title, description, pricePerDay, priceSell, isForRent, isForSale, city, region, imageUrl } = req.body;
    if (!ownerId) return res.status(400).json({ error: "ownerId requis" });
    const item = await prisma.gearListing.create({
      data: { ownerId, title, description, pricePerDay: pricePerDay ? Number(pricePerDay) : undefined, priceSell: priceSell ? Number(priceSell) : undefined, isForRent: !!isForRent, isForSale: !!isForSale, city: city || '', region: region || '', imageUrl: imageUrl || undefined },
      include: { owner: { select: { id: true, name: true } } }
    });
    res.json(item);
  } catch (e: any) { console.error(e); res.status(400).json({ error: e.message || "Erreur création matériel" }); }
});

app.delete("/gear/:id", async (req, res) => {
  try {
    await prisma.gearListing.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: "Erreur suppression matériel" }); }
});

// ────────────────────────────────────────────
// HUB PRO (in-memory pour démo)
// ────────────────────────────────────────────

const proHubMessages: any[] = [];
app.get("/prohub/messages", (_req, res) => res.json(proHubMessages));
app.post("/prohub/messages", (req, res) => {
  const msg = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  proHubMessages.push(msg);
  res.json(msg);
});

// ────────────────────────────────────────────
// ADMIN
// ────────────────────────────────────────────

app.patch("/admin/pros/:id/certify", async (req, res) => {
  try {
    const { certified } = req.body;
    res.json(await prisma.proProfile.update({ where: { id: req.params.id }, data: { isCertified: certified !== false } }));
  } catch (e) { res.status(400).json({ error: "Erreur certification" }); }
});

app.patch("/admin/pros/:id/level", async (req, res) => {
  try {
    res.json(await prisma.proProfile.update({ where: { id: req.params.id }, data: { level: String(req.body.level) } }));
  } catch (e) { res.status(400).json({ error: "Erreur niveau" }); }
});

app.delete("/admin/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: "Erreur suppression" }); }
});

app.put("/admin/users/:id", async (req, res) => {
  try {
    const { name, email, role, city } = req.body;
    res.json(await prisma.user.update({ where: { id: req.params.id }, data: { name, email, role, city } }));
  } catch (e) { res.status(400).json({ error: "Erreur modification" }); }
});

app.get("/admin/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: 'ADMIN' } },
      include: { proProfile: { select: { id: true, isCertified: true, level: true, avgRating: true, profileViews: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (e) { res.status(400).json({ error: "Erreur liste users" }); }
});

app.get("/admin/stats", async (req, res) => {
  try {
    const [totalUsers, totalPros, totalClients, totalMessages, totalBookings, totalContracts, totalInternships] = await Promise.all([
      prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
      prisma.user.count({ where: { role: "PRO" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.message.count(),
      prisma.booking.count(),
      prisma.contract.count(),
      prisma.internship.count(),
    ]);
    const onlineCount = await prisma.user.count({ where: { isOnline: true, role: { not: 'ADMIN' } } });
    res.json({ totalUsers, totalPros, totalClients, totalMessages, totalBookings, totalContracts, totalInternships, onlineCount });
  } catch (e) { res.status(400).json({ error: "Erreur stats" }); }
});

app.listen(4000, () => console.log("ShootPro API running on http://localhost:4000"));
