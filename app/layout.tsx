"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ThirdwebProvider } from "thirdweb/react";

export const fetchCache = 'force-no-store';

const inter = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "700"],
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Certo",
//   description: "Bringing replicability back to science",
// };

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <html lang="en">
      <ThirdwebProvider>
        <SessionProvider session={session}>
          <body className={`bg-dark ${inter.className}`}>
            <Navbar />
            {children}
          </body>
        </SessionProvider>
      </ThirdwebProvider>
    </html>
  );
}
