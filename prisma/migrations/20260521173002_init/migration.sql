-- CreateEnum
CREATE TYPE "Template" AS ENUM ('lux', 'force');

-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('force_ai', 'force_media');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'ar');

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "template" "Template" NOT NULL,
    "brand" "Brand",
    "defaultLocale" "Locale" NOT NULL,
    "enName" TEXT NOT NULL,
    "enTitle" TEXT NOT NULL,
    "arName" TEXT NOT NULL,
    "arTitle" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "phone" TEXT,
    "phoneDisplay" TEXT,
    "whatsapp" TEXT,
    "emails" TEXT[],
    "websites" TEXT[],
    "instagram" TEXT,
    "linkedin" TEXT,
    "x" TEXT,
    "github" TEXT,
    "youtube" TEXT,
    "tiktok" TEXT,
    "copyrightYear" INTEGER NOT NULL DEFAULT 2026,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");

-- CreateIndex
CREATE INDEX "Card_slug_idx" ON "Card"("slug");
