import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export async function signInEvent({ user }: { user: User }) {
  console.log(`User signed in: ${user.email}`);
}

export async function signOutEvent({ token }: { token: JWT }) {
  console.log(`User signed out: ${token.email}`);
}
