/* eslint-disable @next/next/no-img-element */
// import { GetServerSideProps } from "next";
// import { getToken } from "next-auth/jwt";
// import { useSession } from "next-auth/react";

import styles from "styles/Styles.module.css";

export default function Forbidden() {
  // const { status } = useSession({ required: true });

  // if (status === "loading") {
  //   return (
  //     <main className={styles.main}>
  //       <div className={styles.loading}>Carregando sessão...</div>
  //     </main>
  //   );
  // }

  return (
    <main className={styles.main}>
      <img alt="shhhhh" src="/proibido.png" />
    </main>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const token = await getToken({ req });

//   if (!token) {
//     return { redirect: { destination: "/login", permanent: false } };
//   }

//   return { props: {} };
// };
