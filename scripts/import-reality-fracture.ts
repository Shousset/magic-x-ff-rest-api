import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';

// Set code de "Reality Fracture" (expansión principal, 462 cartas, 2026-10-02).
// Se incluyen solo las impresiones de la expansión (unique=prints), ordenadas
// por número de coleccionista, y se recorren todas las páginas de Scryfall.
const SCRYFALL_URL =
  'https://api.scryfall.com/cards/search?q=set%3Afra&unique=prints&order=set';

type ScryfallFace = {
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  artist?: string;
  image_uris?: { normal?: string };
};

type ScryfallCard = {
  name: string;
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  rarity: string;
  set: string;
  collector_number: string;
  artist?: string;
  image_uris?: { normal?: string };
  card_faces?: ScryfallFace[];
};

type ScryfallPage = {
  data: ScryfallCard[];
  has_more: boolean;
  next_page?: string;
  total_cards: number;
};

function combineFaces(
  card: ScryfallCard,
  field: keyof ScryfallFace,
): string | null {
  const value = card[field as keyof ScryfallCard];
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  const values = (card.card_faces ?? [])
    .map((face) => face[field])
    .filter((faceValue): faceValue is string => Boolean(faceValue));

  return values.length > 0 ? values.join(' // ') : null;
}

function mapCard(card: ScryfallCard, index: number) {
  // Algunos layouts (prepare, modal double-faced) no traen image_uris a
  // nivel de carta; en ese caso usamos la primera cara.
  const imageUrl =
    card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null;
  const collectorNumber = card.collector_number;
  const displayOrder = Number.parseInt(collectorNumber, 10);

  return {
    name: card.name,
    manaCost: combineFaces(card, 'mana_cost'),
    oracleText: combineFaces(card, 'oracle_text'),
    power: combineFaces(card, 'power'),
    toughness: combineFaces(card, 'toughness'),
    rarityName: card.rarity.toLowerCase(),
    cardTypeName: combineFaces(card, 'type_line') ?? 'Unknown',
    setCode: card.set.toUpperCase(),
    collectorNumber,
    artist: card.artist ?? combineFaces(card, 'artist'),
    imageUrl,
    displayOrder: Number.isNaN(displayOrder) ? index : displayOrder,
  };
}

async function getPage(url: string): Promise<ScryfallPage> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'magic-x-ff-rest-api/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Scryfall respondió con HTTP ${response.status}`);
  }

  return (await response.json()) as Promise<ScryfallPage>;
}

async function importRealityFractureCards(): Promise<void> {
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  let nextPage: string | undefined = SCRYFALL_URL;
  let pageNumber = 0;
  let processed = 0;
  let inserted = 0;
  let updated = 0;

  try {
    console.log(
      '🔮 Obteniendo cartas de REALITY FRACTURE (FRA) desde Scryfall...',
    );

    while (nextPage) {
      pageNumber += 1;
      console.log(`Página ${pageNumber}...`);
      const page = await getPage(nextPage);

      for (const [index, card] of page.data.entries()) {
        const data = mapCard(card, processed + index);

        const rarity = await prisma.rarity.upsert({
          where: { name: data.rarityName },
          create: { name: data.rarityName },
          update: {},
        });

        const cardType = await prisma.cardType.upsert({
          where: { name: data.cardTypeName },
          create: { name: data.cardTypeName },
          update: {},
        });

        const { rarityName, cardTypeName, ...cardData } = data;

        const existing = await prisma.card.findUnique({
          where: {
            setCode_collectorNumber: {
              setCode: data.setCode,
              collectorNumber: data.collectorNumber,
            },
          },
          select: { id: true },
        });

        await prisma.card.upsert({
          where: {
            setCode_collectorNumber: {
              setCode: data.setCode,
              collectorNumber: data.collectorNumber,
            },
          },
          create: {
            ...cardData,
            rarityId: rarity.id,
            cardTypeId: cardType.id,
          },
          update: {
            ...cardData,
            rarityId: rarity.id,
            cardTypeId: cardType.id,
          },
        });

        if (existing) {
          updated++;
        } else {
          inserted++;
        }
        processed++;
      }

      nextPage = page.has_more ? page.next_page : undefined;

      // Pequeña pausa para respetar rate-limiting de Scryfall
      if (nextPage) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }

    console.log(`✅ Cartas de Reality Fracture procesadas: ${processed}`);
    console.log(`✨ Nuevas cartas insertadas: ${inserted}`);
    console.log(`🔄 Cartas actualizadas: ${updated}`);
    console.log('🎉 Importación de Reality Fracture completada con éxito.');
  } finally {
    await prisma.$disconnect();
  }
}

importRealityFractureCards().catch((error: unknown) => {
  console.error('❌ La importación de Reality Fracture falló:', error);
  process.exitCode = 1;
});