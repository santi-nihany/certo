import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";

// Configuración de las opciones de autenticación
export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "survey-participant";
      return token;
    },
  },
  debug: true,
};

// Definición de las rutas GET y POST usando NextAuth y las opciones configuradas
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
