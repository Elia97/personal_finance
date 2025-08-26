-- CreateTable
CREATE TABLE "public"."Log" (
    "id" SERIAL NOT NULL,
    "event" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
