import "styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "@next/font/google";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const poppins = Poppins({ weight: ["400", "500", "600"], subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={60 * 60}
      refetchOnWindowFocus={false}
    >
      <div className={poppins.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
