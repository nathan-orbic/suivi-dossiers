import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  await db.utilisateur.upsert({
    where: { email: "agent@orbic.fr" },
    update: {},
    create: { email: "agent@orbic.fr", name: "Agent Test", role: "AGENT", password },
  });

  await db.utilisateur.upsert({
    where: { email: "responsable@orbic.fr" },
    update: {},
    create: { email: "responsable@orbic.fr", name: "Responsable Test", role: "RESPONSABLE", password },
  });

  await db.utilisateur.upsert({
    where: { email: "gestionnaire@orbic.fr" },
    update: {},
    create: { email: "gestionnaire@orbic.fr", name: "Gestionnaire Test", role: "GESTIONNAIRE", password },
  });

  console.log("Seed terminé — 3 utilisateurs créés.");
}

main().catch(console.error).finally(() => void db.$disconnect());
