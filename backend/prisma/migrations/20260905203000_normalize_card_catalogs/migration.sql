-- Create catalog tables first so existing Card rows can be migrated safely.
CREATE TABLE "Rarity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Rarity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CardType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "CardType_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Rarity_name_key" ON "Rarity"("name");
CREATE UNIQUE INDEX "CardType_name_key" ON "CardType"("name");

INSERT INTO "Rarity" ("name")
SELECT DISTINCT "rarity" FROM "Card";

INSERT INTO "CardType" ("name")
SELECT DISTINCT "type" FROM "Card";

ALTER TABLE "Card" ADD COLUMN "rarityId" INTEGER;
ALTER TABLE "Card" ADD COLUMN "cardTypeId" INTEGER;

UPDATE "Card" AS card
SET "rarityId" = rarity."id"
FROM "Rarity" AS rarity
WHERE rarity."name" = card."rarity";

UPDATE "Card" AS card
SET "cardTypeId" = card_type."id"
FROM "CardType" AS card_type
WHERE card_type."name" = card."type";

ALTER TABLE "Card" ALTER COLUMN "rarityId" SET NOT NULL;
ALTER TABLE "Card" ALTER COLUMN "cardTypeId" SET NOT NULL;

DROP INDEX "Card_rarity_idx";
DROP INDEX "Card_type_idx";
ALTER TABLE "Card" DROP COLUMN "rarity";
ALTER TABLE "Card" DROP COLUMN "type";

CREATE INDEX "Card_rarityId_idx" ON "Card"("rarityId");
CREATE INDEX "Card_cardTypeId_idx" ON "Card"("cardTypeId");

ALTER TABLE "Card" ADD CONSTRAINT "Card_rarityId_fkey"
    FOREIGN KEY ("rarityId") REFERENCES "Rarity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Card" ADD CONSTRAINT "Card_cardTypeId_fkey"
    FOREIGN KEY ("cardTypeId") REFERENCES "CardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
