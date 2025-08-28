import { Account, Session, User } from "next-auth";
import {
  signIn,
  jwt,
  // redirect,
  // session
} from "../../lib/auth-callbacks";
import { JWT } from "next-auth/jwt";
import prisma from "@/lib/prisma";

describe("SignIn Callback", () => {
  it("Grants access to a user with an external provider and a verified email", async () => {
    const user = {
      email: "test@example.com",
      emailVerified: new Date(),
    } as User;

    const account = {
      provider: "example-provider",
    } as Account;

    const result = await signIn({ user, account });

    expect(result).toBe(true);
  });

  it("Denies access to a user with an external provider and an unverified email", async () => {
    const user = {
      email: "test@example.com",
      emailVerified: undefined,
    } as User;

    const account = {
      provider: "example-provider",
    } as Account;

    const result = await signIn({ user, account });

    expect(result).toBe(false);
  });

  it("Grants access to a user with the 'credentials' and an unverified email within 30 days", async () => {
    const user = {
      email: "test@example.com",
      emailVerified: undefined,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    } as User;

    const account = {
      provider: "credentials",
    } as Account;

    const result = await signIn({ user, account });

    expect(result).toBe(true);
  });

  it("Denies access to a user with the 'credentials' and an unverified email after 30 days", async () => {
    const user = {
      email: "test@example.com",
      emailVerified: undefined,
      createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // 31 days ago
    } as User;

    const account = {
      provider: "credentials",
    } as Account;

    const result = await signIn({ user, account });

    expect(result).toBe(false);
  });
});

describe("JWT Callback", () => {
  let userId: string;
  let token: JWT;
  let session: Partial<Session>;

  beforeAll(async () => {
    // Pulizia del database e creazione di un utente di test
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@example.com",
        image: "test-image.jpg",
        language: "en",
        country: "US",
      },
    });
    userId = user.id;
  });

  beforeEach(() => {
    // Inizializza il token e la sessione con valori predefiniti
    token = {
      id: userId,
      name: "Old Name",
      email: "old@example.com",
      picture: "old-pic.jpg",
      language: "en",
      country: "US",
      iat: Math.floor(Date.now() / 1000),
    } as JWT;

    session = {
      user: {
        id: userId,
        name: "Updated User",
        email: "updateduser@example.com",
        image: "updated-image.jpg",
        language: "fr",
        country: "FR",
      },
    };
  });

  afterEach(() => {
    // Ripulisci le variabili per garantire che i test siano indipendenti
    token = {} as JWT;
    session = {};
  });

  afterAll(async () => {
    // Chiudi la connessione al database dopo i test
    await prisma.$disconnect();
  });

  it("Adds user information to the token on first login", async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const newToken = await jwt({
      token: {} as JWT,
      user,
    });

    expect(newToken.name).toBe("Test User");
    expect(newToken.email).toBe("testuser@example.com");
    expect(newToken.picture).toBe("test-image.jpg");
    expect(newToken.id).toBe(userId);
    expect(newToken.language).toBe("en");
    expect(newToken.country).toBe("US");
  });

  it("Should update the token and database on session update", async () => {
    const updatedToken = await jwt({
      token: { ...token, iat: Math.floor(Date.now() / 1000) }, // Imposta un timestamp corrente
      session,
      trigger: "update",
    });

    // Verifica che il token sia stato aggiornato
    expect(updatedToken.name).toBe("Updated User");
    expect(updatedToken.email).toBe("updateduser@example.com");
    expect(updatedToken.picture).toBe("updated-image.jpg");
    expect(updatedToken.language).toBe("fr");
    expect(updatedToken.country).toBe("FR");

    // Verifica che il database sia stato aggiornato
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(updatedUser?.name).toBe("Updated User");
    expect(updatedUser?.email).toBe("updateduser@example.com");
    expect(updatedUser?.image).toBe("updated-image.jpg");
    expect(updatedUser?.language).toBe("fr");
    expect(updatedUser?.country).toBe("FR");
  });

  it("Refreshes user data from the database", async () => {
    const refreshedToken = await jwt({
      token: { ...token, iat: token.iat! - 3601 }, // Simula un token scaduto
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(refreshedToken.name).toBe(user?.name);
    expect(refreshedToken.email).toBe(user?.email);
    expect(refreshedToken.picture).toBe(user?.image);
    expect(refreshedToken.language).toBe(user?.language);
    expect(refreshedToken.country).toBe(user?.country);
  });

  it("Handles missing user gracefully and logs an error", async () => {
    // Spia per intercettare console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Simula un token con un ID utente che non esiste nel database e un iat scaduto
    const missingUserToken = {
      id: "non-existent-user-id",
      iat: Math.floor(Date.now() / 1000) - 3601, // Simula un token emesso più di un'ora fa
    } as JWT;

    // Chiama la funzione jwt con il token di un utente inesistente
    const resultToken = await jwt({
      token: missingUserToken,
    });

    // Verifica che il token non contenga dati relativi all'utente
    expect(resultToken.name).toBeUndefined();
    expect(resultToken.email).toBeUndefined();
    expect(resultToken.picture).toBeUndefined();
    expect(resultToken.language).toBeUndefined();
    expect(resultToken.country).toBeUndefined();

    // Verifica che console.error sia stato chiamato con il messaggio corretto
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error during token refresh: User with ID non-existent-user-id not found.`
    );

    // Ripristina il comportamento originale di console.error
    consoleErrorSpy.mockRestore();
  });
});

// describe("session callback", () => {
//   it("Extends the session with user data from the token", async () => {
//     const token = {
//       id: "user-id",
//       name: "Test User",
//       email: "test@example.com",
//       picture: "image-url",
//       role: "ADMIN" as UserRole,
//     };
//     const baseSession = {
//       user: { id: "user-id" },
//       expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
//     };

//     const extendedSession = await session({ session: baseSession, token });

//     expect(extendedSession.user.id).toBe("user-id");
//     expect(extendedSession.user.name).toBe("Test User");
//     expect(extendedSession.user.email).toBe("test@example.com");
//     expect(extendedSession.user.role).toBe("ADMIN");
//   });
// });

// describe("redirect callback", () => {
//   const baseUrl = "https://example.com";

//   it("Allows internal redirects", async () => {
//     const url = "/dashboard";
//     const result = await redirect({ url, baseUrl });

//     expect(result).toBe("https://example.com/dashboard");
//   });

//   it("Allows external redirects within the same domain", async () => {
//     const url = "https://example.com/profile";
//     const result = await redirect({ url, baseUrl });

//     expect(result).toBe(url);
//   });

//   it("Denies redirects to external domains", async () => {
//     const url = "https://malicious.com";
//     const result = await redirect({ url, baseUrl });

//     expect(result).toBe(baseUrl);
//   });
// });
