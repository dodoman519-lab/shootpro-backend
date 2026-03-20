-- =============================================
-- Migration: add_missing_columns
-- Ajoute toutes les colonnes/tables manquantes
-- par rapport à la migration initiale SQLite.
-- Cible : PostgreSQL (production Render)
-- =============================================

-- 1. Colonnes manquantes sur User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "siret"    TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isOnline" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastSeen" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "fcmToken" TEXT;

-- 2. Colonne manquante sur ProProfile
ALTER TABLE "ProProfile" ADD COLUMN IF NOT EXISTS "pricePhoto" INTEGER;

-- 3. Colonnes manquantes sur Availability
ALTER TABLE "Availability" ADD COLUMN IF NOT EXISTS "startTime" TEXT;
ALTER TABLE "Availability" ADD COLUMN IF NOT EXISTS "endTime"   TEXT;

-- 4. Colonne imageUrl sur GearListing (cause principale de ce déploiement)
ALTER TABLE "GearListing" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- 5. Table Notification (si elle n'existe pas encore)
CREATE TABLE IF NOT EXISTS "Notification" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "type"      TEXT NOT NULL,
    "message"   TEXT NOT NULL,
    "isRead"    BOOLEAN NOT NULL DEFAULT false,
    "link"      TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Table AppConfig (version APK + lien de téléchargement)
CREATE TABLE IF NOT EXISTS "AppConfig" (
    "id"        TEXT NOT NULL,
    "key"       TEXT NOT NULL,
    "value"     TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- Index unique sur AppConfig.key
CREATE UNIQUE INDEX IF NOT EXISTS "AppConfig_key_key" ON "AppConfig"("key");
