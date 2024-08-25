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
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className="text-white">You are not signed in</span>
              <button
                className="bg-primary text-black rounded-lg p-2"
                onClick={(e) => {
                  e.preventDefault();
                  signIn("worldcoin"); // worldcoin es el único proveedor
                }}
              >
                Sign in
              </button>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
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
        </p>
      </div>
    </header>
  );
}
