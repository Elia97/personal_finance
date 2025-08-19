import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type {
  NextAuthOptions,
  User as NextAuthUser,
  Session as NextAuthSession,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { SessionStrategy } from "next-auth";

// Definizione dei tipi per ruoli e status
export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

// Definizione del tipo User esteso
export interface ExtendedUser extends NextAuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  password?: string;
  role?: UserRole;
  phone?: string | null;
  language?: string | null;
  country?: string | null;
  dateOfBirth?: Date | null;
  status?: UserStatus;
  lastLogin?: Date | null;
  settings?: Record<string, unknown>; // JSON field
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definizione del tipo Session esteso
export interface ExtendedSession extends NextAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
    phone?: string | null;
    language?: string | null;
    country?: string | null;
    status?: UserStatus;
    lastLogin?: Date | null;
  };
}

// Definizione del tipo JWT esteso
export interface ExtendedJWT extends JWT {
  id?: string;
  role?: UserRole;
  emailVerified?: Date | null;
}

const strategy: SessionStrategy = "jwt";

// Configurazione dei provider in modo modulare
const getProviders = () => {
  const providers = [];

  // Provider OAuth - solo se le variabili d'ambiente sono presenti
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true, // Per collegare account con stessa email
      })
    );
  }

  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    );
  }

  // Provider Credentials - sempre presente
  providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "nome@esempio.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e password sono obbligatori");
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
            throw new Error("Credenziali non valide");
          }

          // Controlla se l'account è attivo
          if (user.status !== "ACTIVE") {
            const statusText = user.status
              ? user.status.toLowerCase()
              : "compromesso";
            throw new Error(`Account ${statusText}. Contatta il supporto.`);
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Credenziali non valide");
          }

          // Aggiorna lastLogin
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });

          // Rimuovi la password dall'oggetto restituito
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;

          return userWithoutPassword as ExtendedUser;
        } catch (error) {
          console.error("Errore durante l'autenticazione:", error);
          return null;
        }
      },
    })
  );

  return providers;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: getProviders(),

  session: {
    strategy,
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
    updateAge: 24 * 60 * 60, // Aggiorna ogni 24 ore
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
    secret: process.env.NEXTAUTH_SECRET,
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user", // Redirect per nuovi utenti
  },

  callbacks: {
    async signIn({ user, account }) {
      // Permetti il sign-in solo se l'email è verificata (per OAuth)
      if (account?.provider === "google" || account?.provider === "github") {
        return true;
      }

      // Per credentials, controlla se l'email è verificata e lo status
      if (account?.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            emailVerified: true,
            status: true,
          },
        });

        // Blocca l'accesso se l'account non è attivo
        if (dbUser?.status !== "ACTIVE") {
          return false;
        }

        return true;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }): Promise<JWT> {
      // Al primo login, aggiungi informazioni dall'utente al token
      if (user) {
        token.id = user.id;
        token.role = (user as ExtendedUser).role ?? undefined;
        token.phone = (user as ExtendedUser).phone ?? undefined;
        token.language = (user as ExtendedUser).language ?? undefined;
        token.country = (user as ExtendedUser).country ?? undefined;
        token.status = (user as ExtendedUser).status ?? undefined;
        token.lastLogin = (user as ExtendedUser).lastLogin ?? undefined;
        token.emailVerified = (user as ExtendedUser).emailVerified;
      }

      // Se è un trigger di update della session, aggiorna il token
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
      }

      // Ricarica i dati utente dal database periodicamente (ogni ora)
      if (
        token.id &&
        (typeof token.iat !== "number" ||
          Date.now() - Number(token.iat) * 1000 > 60 * 60 * 1000)
      ) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              phone: true,
              language: true,
              country: true,
              status: true,
              lastLogin: true,
              emailVerified: true,
            },
          });

          if (dbUser) {
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
            token.role = dbUser.role ?? undefined;
            token.phone = dbUser.phone ?? undefined;
            token.language = dbUser.language ?? undefined;
            token.country = dbUser.country ?? undefined;
            token.status = dbUser.status ?? undefined;
            token.lastLogin = dbUser.lastLogin ?? undefined;
            token.emailVerified = dbUser.emailVerified;
          }
        } catch (error) {
          console.error("Errore durante il refresh del token:", error);
        }
      }

      return token;
    },

    async session({ session, token }): Promise<ExtendedSession> {
      // Assicurati che tutti i campi siano definiti
      const extendedSession: ExtendedSession = {
        ...session,
        user: {
          id: token.id as string,
          name: token.name ?? "",
          email: token.email ?? "",
          image: token.picture ?? null,
          role: (token as ExtendedJWT).role ?? "USER",
          phone:
            typeof (token as ExtendedJWT).phone === "string"
              ? (token as ExtendedJWT).phone
              : null,
          language:
            typeof (token as ExtendedJWT).language === "string"
              ? (token as ExtendedJWT).language
              : null,
          country:
            typeof (token as ExtendedJWT).country === "string"
              ? (token as ExtendedJWT).country
              : null,
          status:
            typeof (token as ExtendedJWT).status === "string"
              ? ((token as ExtendedJWT).status as UserStatus)
              : "ACTIVE",
          lastLogin:
            (token as ExtendedJWT).lastLogin instanceof Date
              ? (token as ExtendedJWT).lastLogin
              : null,
        },
      };

      return extendedSession;
    },

    async redirect({ url, baseUrl }) {
      // Permetti redirect solo al dominio dell'app
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`Nuovo login: ${user.email} via ${account?.provider}`);

      // Qui puoi aggiungere logiche come logging, analytics, etc.
      if (isNewUser) {
        console.log(`Nuovo utente registrato: ${user.email}`);
      }
    },

    async signOut({ session, token }) {
      console.log(`Logout: ${session?.user?.email || token?.email}`);
    },
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
