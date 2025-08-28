import prisma from "@/lib/prisma";
import { User } from "next-auth";

describe("Database User Tests", () => {
  beforeAll(async () => {
    // Pulizia del database prima di ogni test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Chiudi la connessione al database dopo i test
    await prisma.$disconnect();
  });

  it("should create a new user after sign up", async () => {
    const newUser: User = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@example.com",
        password: "securepassword",
      },
    });

    // Verifica che l'utente sia stato creato correttamente
    expect(newUser).toHaveProperty("id");
    expect(newUser.name).toBe("Test User");
    expect(newUser.email).toBe("testuser@example.com");
    expect(newUser.role).toBe("USER");
    expect(newUser.status).toBe("ACTIVE");
  });
});
