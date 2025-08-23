import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { verifyPassword } from "./auth-utils";
import type { ExtendedUser } from "@/types/auth";

// Dynamically configure authentication providers
export const getProviders = () => {
  const providers = [];

  // OAuth Provider - only if environment variables are set
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true, // Allow linking accounts with the same email
        authorization: {
          params: {
            prompt: "select_account",
          },
        },
        profile(profile) {
          let name = "";
          if (profile.given_name && profile.family_name) {
            name = `${profile.given_name} ${profile.family_name}`;
          } else if (profile.given_name) {
            name = profile.given_name;
          } else if (profile.name) {
            name = profile.name;
          }
          return {
            id: profile.sub,
            email: profile.email,
            name,
            image: profile.picture,
            emailVerified: profile.email_verified ? new Date() : null,
          };
        },
      })
    );
  }

  // Credentials Provider - always available
  providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "name@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              role: true,
              phone: true,
              language: true,
              country: true,
              dateOfBirth: true,
              status: true,
              lastLogin: true,
              settings: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          // Check if the account is active
          if (user.status !== "ACTIVE") {
            const statusText = user.status
              ? user.status.toLowerCase()
              : "compromised";
            throw new Error(`Account ${statusText}. Contact support.`);
          }

          if (!(await verifyPassword(credentials.password, user.password))) {
            throw new Error("Invalid credentials");
          }

          // Update lastLogin timestamp
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });

          // Remove password from the returned object
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;

          return userWithoutPassword as ExtendedUser;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    })
  );

  return providers;
};
