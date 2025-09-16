import prisma from "@/lib/prisma";

export async function createVerificationToken(
  email: string,
  token: string,
  expires: Date,
) {
  return prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });
}

export async function findVerificationToken(token: string) {
  return prisma.verificationToken.findUnique({
    where: { token },
  });
}

export async function deleteVerificationToken(token: string) {
  return prisma.verificationToken.delete({
    where: { token },
  });
}
