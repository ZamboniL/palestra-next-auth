import { useState } from "react";
import styles from "styles/Styles.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Formulário enviado!", { email, password });

    const res = await signIn("credentials-auth", {
      username: email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    }

    console.log(res?.error);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </main>
  );
}
