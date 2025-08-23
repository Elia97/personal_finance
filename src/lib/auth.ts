import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { getProviders } from "@/lib/auth-providers";
import { signIn, jwt, session, redirect } from "@/lib/auth-callbacks";
import { signInEvent, signOutEvent } from "@/lib/auth-events";

const strategy = "jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: getProviders(),
  session: {
    strategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user", // Redirect for new users
  },
  callbacks: {
    signIn,
    jwt,
    session,
    redirect,
  },
  events: {
    signIn: signInEvent,
    signOut: signOutEvent,
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
