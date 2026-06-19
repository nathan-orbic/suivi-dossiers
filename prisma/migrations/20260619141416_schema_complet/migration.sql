/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'RESPONSABLE', 'GESTIONNAIRE');

-- CreateEnum
CREATE TYPE "EtatDossier" AS ENUM ('RECU', 'EN_COURS', 'EN_ATTENTE', 'EN_ATTENTE_VALIDATION', 'VALIDE', 'CLOTURE', 'BLOQUE');

-- CreateEnum
CREATE TYPE "TypeElement" AS ENUM ('NOTE', 'OBSERVATION', 'PIECE');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'AGENT',

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dossier" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "intitule" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "demandeur" TEXT NOT NULL,
    "referenceExterne" TEXT,
    "etatCourant" "EtatDossier" NOT NULL,
    "etatAvantSuspension" "EtatDossier",
    "agentId" TEXT,
    "dateReception" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transition" (
    "id" TEXT NOT NULL,
    "dossierId" TEXT NOT NULL,
    "etatSource" "EtatDossier" NOT NULL,
    "etatCible" "EtatDossier" NOT NULL,
    "auteurId" TEXT NOT NULL,
    "motif" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElementInstruction" (
    "id" TEXT NOT NULL,
    "dossierId" TEXT NOT NULL,
    "type" "TypeElement" NOT NULL,
    "contenu" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElementInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_reference_key" ON "Dossier"("reference");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "Dossier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementInstruction" ADD CONSTRAINT "ElementInstruction_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "Dossier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementInstruction" ADD CONSTRAINT "ElementInstruction_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
