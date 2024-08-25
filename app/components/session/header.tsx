import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./header.module.css";

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={`${styles.signedInStatus} bg-primary`}>
        <div
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <p className="flex  justify-center items-center ">
              <span className="text-black">
                Participate in a survey and earn rewards |
              </span>
              <button
                className=" text-black font-bold underline p-2"
                onClick={(e) => {
                  e.preventDefault();
                  signIn("worldcoin"); // worldcoin es el único proveedor
                }}
              >
                Prove you are a human
              </button>
            </p>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}
              <button
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
