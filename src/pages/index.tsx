import styles from "styles/Styles.module.css";
import Link from "next/link";
import Secret from "components/Secret";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { status, data } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const email = data?.user?.email;

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>Carregando sessão...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className={styles.main}>
        <div className="">Você está desconectado!</div>
        <p>
          <Link href="/login">Clique aqui para logar.</Link>
        </p>
        <Secret />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className="">Você está logado {email}!</div>
      <p>
        <a onClick={() => signOut({ callbackUrl: "/", redirect: false })}>
          Clique aqui para sair.
        </a>
      </p>
      <Secret />
    </main>
  );
}
