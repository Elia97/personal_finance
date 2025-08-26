import { Account, User } from "next-auth";
import { signIn } from "../../lib/auth-callbacks";

describe("Ensure access is denied when the provider is not 'credentials' and the user's email is unverified", () => {
  it("Grants access to a user with an external provider and a verified email", async () => {
    const user: User = {
      id: "example-id",
      email: "test@example.com",
      name: "Test User",
      image: "example-image-url",
      emailVerified: new Date(),
    };
    const account: Account = {
      provider: "google",
      type: "oauth",
      providerAccountId: "example-id",
      access_token: "example-access-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      scope: "example-scope",
      token_type: "Bearer",
      id_token: "example-id-token",
    };

    const result = await signIn({ user, account });

    expect(result).toBe(true);
  });

  it("Denies access to a user with an external provider and an unverified email", async () => {
    const user: User = {
      id: "example-id",
      email: "test@example.com",
      name: "Test User",
      image: "example-image-url",
      emailVerified: null,
    };
    const account: Account = {
      provider: "example-provider",
      type: "oauth",
      providerAccountId: "example-id",
      access_token: "example-access-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      scope: "example-scope",
      token_type: "example-token-type",
      id_token: "example-id-token",
    };

    const result = await signIn({ user, account });

    expect(result).toBe(false);
  });

  it("Grants access to a user with the 'credentials' provider without requiring email verification", async () => {
    const user: User = {
      id: "example-id",
      email: "test@example.com",
      name: "Test User",
      image: null,
      role: "USER",
      phone: null,
      language: null,
      country: null,
      dateOfBirth: null,
      status: "ACTIVE",
      lastLogin: null,
      settings: undefined,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const account: Account = {
      providerAccountId: "example-id",
      type: "credentials",
      provider: "credentials",
    };

    const result = await signIn({ user, account });

    expect(result).toBe(true);
  });
});
