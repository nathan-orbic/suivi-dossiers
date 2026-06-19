"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import styles from "./page.module.css";

function ConnexionForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/tableau-de-bord";
  const hasError = searchParams.get("error") === "CredentialsSignin";

  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const data = new FormData(e.currentTarget);
    await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      callbackUrl,
    });
    setPending(false);
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Mot de passe
          </label>
          <input
            className={styles.input}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={pending}>
          Se connecter
        </button>
        {hasError && <p className={styles.error}>Identifiants invalides.</p>}
      </form>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <div className={styles.page}>
      <Suspense>
        <ConnexionForm />
      </Suspense>
    </div>
  );
}
