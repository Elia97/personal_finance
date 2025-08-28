import { Account, User } from "next-auth";
import { UserStatus, UserRole } from "@/types/auth";
import {
  signIn,
  jwt,
  // redirect,
  // session
} from "../../lib/auth-callbacks";

describe("signIn callback", () => {
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
      emailVerified: null,
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
      emailVerified: null,
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
      emailVerified: null,
      createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // 31 days ago
    } as User;

    const account = {
      provider: "credentials",
    } as Account;

    const result = await signIn({ user, account });

    expect(result).toBe(false);
  });
});

describe("jwt callback", () => {
  it("Adds user information to the token on first login", async () => {
    const user: User = {
      id: "user-id",
      role: "ADMIN" as UserRole,
      phone: "123456789",
      language: "en",
      country: "US",
      dateOfBirth: new Date("1990-01-01"),
      status: "ACTIVE" as UserStatus,
      lastLogin: new Date(),
      emailVerified: new Date(),
    };

    const token = await jwt({
      token: {},
      user,
    });

    expect(token.id).toBe(user.id);
    expect(token.role).toBe(user.role);
    expect(token.phone).toBe(user.phone);
    expect(token.language).toBe(user.language);
    expect(token.country).toBe(user.country);
    expect(token.dateOfBirth).toEqual(user.dateOfBirth);
    expect(token.status).toBe(user.status);
    expect(token.lastLogin).toEqual(user.lastLogin);
    expect(token.emailVerified).toEqual(user.emailVerified);
  });

  // it("Updates the token on session update", async () => {
  //   const token = { id: "user-id", email: "old@example.com" };
  //   const session = { user: { id: "user-id", email: "new@example.com" } };
  //   const updatedToken = await jwt({ token, session, trigger: "update" });

  //   expect(updatedToken.email).toBe("new@example.com");
  // });

  // it("Refreshes user data from the database", async () => {
  //   (prisma.user.findUnique as jest.Mock).mockResolvedValue({
  //     id: "user-id",
  //     email: "db@example.com",
  //     name: "DB User",
  //   });

  //   const token = { id: "user-id", iat: Date.now() / 1000 - 3601 }; // Simula un token scaduto
  //   const refreshedToken = await jwt({ token });

  //   expect(refreshedToken.email).toBe("db@example.com");
  //   expect(refreshedToken.name).toBe("DB User");
  // });

  // it("Handles missing user gracefully", async () => {
  //   const token = { id: "user-id" };
  //   (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // Nessun utente trovato

  //   const refreshedToken = await jwt({ token });

  //   expect(refreshedToken.email).toBeUndefined();
  //   expect(refreshedToken.name).toBeUndefined();
  // });
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
