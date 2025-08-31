import {
  isAdmin,
  getUserSettings,
  updateUserSettings,
  hashPassword,
  verifyPassword,
  createVerificationToken,
  sendVerificationEmail,
} from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/resend";
import { getServerSession } from "next-auth/next";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  verificationToken: {
    create: jest.fn().mockImplementation(({ data }) => {
      return Promise.resolve({
        token: "randomToken",
        identifier: data.identifier,
        expires: data.expires,
      });
    }),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("@/lib/resend", () => ({
  sendEmail: jest.fn(),
}));

// Definizione manuale dei tipi UserRole e UserStatus
enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// Definizione manuale del tipo User
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: Date | null;
  image: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  phone: string | null;
  language: string;
  country: string;
  dateOfBirth: Date | null;
  lastLogin: Date;
  settings: { theme: string };
}

describe("auth-utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("isAdmin", () => {
    it("should return true if the user is an admin", async () => {
      // Correggo il mock di getServerSession per restituire un utente admin
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { email: "admin@example.com", role: UserRole.ADMIN },
      });

      // Correggo il mock di prisma.user.findUnique per restituire un utente admin
      jest.spyOn(prisma.user, "findUnique").mockResolvedValueOnce({
        role: UserRole.ADMIN,
        email: "admin@example.com",
        status: UserStatus.ACTIVE,
      } as User);

      const result = await isAdmin();
      expect(result).toBe(true);
    });

    it("should return false if the user is not an admin", async () => {
      const mockSession = { user: { email: "user@example.com" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

      const mockUser = {
        id: "1",
        name: "Regular User",
        email: "user@example.com",
        role: UserRole.USER,
        emailVerified: null,
        image: null,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: "hashedPassword",
        phone: null,
        language: "en",
        country: "US",
        dateOfBirth: null,
        lastLogin: new Date(),
        settings: { theme: "light" },
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(mockUser);

      const result = await isAdmin();
      expect(result).toBe(false);
    });
  });

  describe("getUserSettings", () => {
    it("should return user settings", async () => {
      const mockUser = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        emailVerified: null,
        image: null,
        password: "hashedPassword",
        role: UserRole.USER,
        phone: null,
        language: "en",
        country: "US",
        dateOfBirth: null,
        lastLogin: new Date(),
        settings: {},
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      jest.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(mockUser);

      const result = await getUserSettings("1");
      expect(result).toEqual({});
    });
  });

  describe("updateUserSettings", () => {
    it("should update user settings", async () => {
      const mockUser = {
        id: "1",
        settings: { theme: "light" },
        role: "USER" as UserRole,
        name: "Test User",
        email: "test@example.com",
        emailVerified: null,
        image: null,
        status: "ACTIVE" as UserStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: "hashedPassword",
        phone: null,
        language: "en",
        country: "US",
        dateOfBirth: null,
        lastLogin: new Date(),
      };
      jest.spyOn(prisma.user, "update").mockResolvedValueOnce(mockUser);

      await expect(
        updateUserSettings("1", mockUser.settings)
      ).resolves.toBeUndefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { settings: mockUser.settings },
      });
    });
  });

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const mockHash = "hashedPassword";
      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce(mockHash as never);

      const result = await hashPassword("password123");
      expect(result).toBe(mockHash);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
    });
  });

  describe("verifyPassword", () => {
    it("should verify a password", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);

      const result = await verifyPassword("password123", "hashedPassword");
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
    });
  });

  describe("createVerificationToken", () => {
    it("should create a verification token", async () => {
      const mockToken = "randomToken";
      const mockVerificationToken = {
        token: mockToken,
        identifier: "test@example.com",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      jest
        .spyOn(prisma.verificationToken, "create")
        .mockResolvedValueOnce(mockVerificationToken);

      const result = await createVerificationToken("test@example.com");
      expect(result).toBe(mockToken);
      expect(prisma.verificationToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ identifier: "test@example.com" }),
      });
    });
  });

  describe("sendVerificationEmail", () => {
    it("should send a verification email", async () => {
      const mockToken = "randomToken";
      const mockEmail = "test@example.com";

      await sendVerificationEmail(mockEmail, mockToken);
      expect(sendEmail).toHaveBeenCalledWith(
        mockEmail,
        expect.any(String),
        expect.stringContaining(mockToken)
      );
    });
  });
});

jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => "randomToken"),
}));
