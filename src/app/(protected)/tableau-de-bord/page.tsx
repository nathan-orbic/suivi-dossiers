import { redirect } from "next/navigation";

import { auth, signOut } from "~/server/auth";

export default async function TableauDeBordPage() {
  const session = await auth();
  if (!session) redirect("/connexion");

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Tableau de bord</h1>
      <p>
        Connecté en tant que <strong>{session.user.name ?? session.user.email}</strong>
        {" — "}rôle : <strong>{session.user.role}</strong>
      </p>

      {/* Bouton de déconnexion temporaire — supprimé en Story 1.6 quand la Sidebar est créée */}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/connexion" });
        }}
      >
        <button type="submit" style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Déconnexion
        </button>
      </form>
    </main>
  );
}
