import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Navbar from "./components/navbar/Navbar";

const inter = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "700", ], 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Certo",
  description: "Bringing replicability back to science",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
      <body className={`bg-dark ${inter.className}`}>
        <Navbar />
        {children}
        </body>
      </UserProvider>
    
    </html>
  );
}
