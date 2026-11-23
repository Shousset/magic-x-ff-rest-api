-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "manaCost" TEXT,
    "type" TEXT NOT NULL,
    "oracleText" TEXT,
    "power" TEXT,
    "toughness" TEXT,
    "rarity" TEXT NOT NULL,
    "setCode" TEXT NOT NULL DEFAULT 'FIN',
    "collectorNumber" TEXT NOT NULL,
    "artist" TEXT,
    "imageUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Card_setCode_idx" ON "Card"("setCode");

-- CreateIndex
CREATE INDEX "Card_name_idx" ON "Card"("name");

-- CreateIndex
CREATE INDEX "Card_rarity_idx" ON "Card"("rarity");

-- CreateIndex
CREATE INDEX "Card_type_idx" ON "Card"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Card_setCode_collectorNumber_key" ON "Card"("setCode", "collectorNumber");
