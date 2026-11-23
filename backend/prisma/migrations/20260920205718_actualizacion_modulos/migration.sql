-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATOR', 'PLAYER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PLAYER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isFoil" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "CollectionEntry_userId_idx" ON "CollectionEntry"("userId");

-- CreateIndex
CREATE INDEX "CollectionEntry_cardId_idx" ON "CollectionEntry"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionEntry_userId_cardId_isFoil_key" ON "CollectionEntry"("userId", "cardId", "isFoil");

-- AddForeignKey
ALTER TABLE "CollectionEntry" ADD CONSTRAINT "CollectionEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionEntry" ADD CONSTRAINT "CollectionEntry_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
