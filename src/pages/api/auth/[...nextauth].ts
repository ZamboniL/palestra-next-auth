import { postAuth } from "api";
import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials-auth",
      type: "credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const { data: res } = await postAuth({
            username: credentials.username,
            password: credentials.password,
          });

          if (res) {
            return {
              id: res.uuid,
              token: res.token,
              email: credentials.username,
              groups: res.groups,
            };
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            throw new Error(
              JSON.stringify({
                message: err.response?.data?.message,
                type: err?.response?.data.type,
                status: err.response?.status,
              })
            );
          }

          return null;
        }
      },
    }),
  ],
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
        session.token = token.apiToken;
        session.groups = token.groups;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", signOut: "/logout" },
  session: {
    maxAge: 60 * 60 * 8,
  },
});
