## Server

## Rota dinâmica

```js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({}),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", signOut: "/logout" },
  session: {
    maxAge: 60 * 60 * 8,
  },
});
```

Para o NextAuth funcionar no projeto é necessário adicionar uma rota de api dinâmica, que irá configurar todas as rotas usadas pela biblioteca

### Providers

```js
providers: [
      CredentialsProvider({
        name: 'Credentials',
        id: 'credentials-auth',
        type: 'credentials',
        credentials: {
          username: { type: 'text' },
          password: { type: 'password' }
        },
        async authorize(credentials) {
          if (!credentials) return null;

          try {
            const res = await postAuth(
              credentials.username,
              credentials.password
            );

            const user = res.data;

            if (user) {
              const { uuid, token, groups } = user;

              return {
                id: uuid,
                token,
                email: credentials.username,
                groups,
              };
            }

            return null;
          } catch (err) {
            console.log(err);
            if (axios.isAxiosError(err))
              throw new Error(
                JSON.stringify({
                  message: err?.response?.data.message,
                  type: err?.response?.data.type,
                  status: false,
                })
            );

            return null;
          }
        }
      })
    ],
```

Como a biblioteca possuí dezenas de providers (google, facebook, github, gitlab, etc..), eu vou explicar apenas o que é atualmente relevante para nós que é o baseado em credenciais.

### Callbacks

```js
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.accessToken = user.token;
        token.groups = user.groups;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = Number(token.sub);
        session.token = token.accessToken;
        session.groups = token.groups;
      }

      return session;
    },
  }
```

Callbacks são funções que você pode usar para controlar ações que são executadas pelo servidor

## Cliente

### Como propagar dados da sessão

```tsx
<SessionProvider
  session={session}
  refetchInterval={60 * 60}
  refetchOnWindowFocus={false}
>
  <Component {...pageProps} />
</SessionProvider>
```

Este componente garante que os dados da sessão estarão disponíveis para toda a aplicação, ele usa o Contexto do React por debaixo dos panos

### Como autenticar o usuário

```js
await signIn("credentials-auth", { username, password, redirect: false });
{
  /**
   * Will be different error codes,
   * depending on the type of error.
   */
  error: string | undefined;
  /**
   * HTTP status code,
   * hints the kind of error that happened.
   */
  status: number;
  /**
   * `true` if the signin was successful
   */
  ok: boolean;
  /**
   * `null` if there was an error,
   * otherwise the url the user
   * should have been redirected to.
   */
  url: string | null;
}
```

A função `signIn` do pacote é o metodo de se fazer login, é necessário passar o nome da estratégia e os valores pedidos.

A flag redirect serve para escolher se a função deveria redirecionar o usuário caso tenha algum erro ou não, caso não a função retorna uma promise com diversos dados.

### Como deslogar o usuário

```js
signOut({ callbackUrl: "/", redirect: false });
```

É a função usada para deslogar o usuário e garantir que todos os dados locais dele foram apagados.

### Como Verificar dados do usuário

```js
const session = useSession();
```

O hook useSession é a maneira mais fácil de verificar a autenticação de um usuário. Ele retorna um objeto com dois valores `data` e `status`, `data` contém os dados do usuário que estão dentro do token JWT e o `status` é uma string com três possibilidades `"loading | "authenticated" | "unauthenticated".

## Maneiras de bloquear usuário de acessar conteúdo não autorizado

### Pelo cliente

```js
const { status } = useSession({ required: true });

if (status === "loading") {
  return <div className={styles.loading}>Carregando sessão...</div>;
}
```

É a maneira mais simples, tem só que utilizar o hook useSession e passar para ele a flag required, porém dessa maneira o usuário consegue ver um flash da tela que ele não tem autorização ainda.

### Pelo server

```js
import { getToken } from "next-auth/jwt";

export const getServerSideProps = ({ req }) => {
  try {
    const token = await getToken({ req });
    return { props: {} };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }
}
```

Nesse método o usuário não vê um flash de conteúdo não autorizado, porém agora temos um tempo maior de carregamento da tela, pois tem a necessidade de verificar no servidor.

### middleware

```js
export { default } from "next-auth/middleware"

export const config = { matcher: ["/proibido"] }
```

Uma funcionalidade mais recente do Nextjs que permite que uma verificação seja realizada antes de cada rota.