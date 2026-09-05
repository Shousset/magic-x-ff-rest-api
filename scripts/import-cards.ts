import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';

const SCRYFALL_URL =
    'https://api.scryfall.com/cards/search?q=set%3Afin&unique=prints&order=set';

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
    const imageUrl =
        card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null;
    const collectorNumber = card.collector_number;
    const displayOrder = Number.parseInt(collectorNumber, 10);

    return {
        name: card.name,
        manaCost: combineFaces(card, 'mana_cost'),
        type: combineFaces(card, 'type_line') ?? 'Unknown',
        oracleText: combineFaces(card, 'oracle_text'),
        power: combineFaces(card, 'power'),
        toughness: combineFaces(card, 'toughness'),
        rarity: card.rarity,
        setCode: card.set.toUpperCase(),
        collectorNumber,
        artist: card.artist ?? combineFaces(card, 'artist'),
        imageUrl,
        displayOrder: Number.isNaN(displayOrder) ? index : displayOrder,
    };
}

async function getPage(url: string): Promise<ScryfallPage> {
    const response = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'magic-x-ff-rest-api/1.0' },
    });

    if (!response.ok) {
        throw new Error(`Scryfall responded with HTTP ${response.status}`);
    }

    return response.json() as Promise<ScryfallPage>;
}

async function importCards(): Promise<void> {
    const prisma = new PrismaService();
    let nextPage: string | undefined = SCRYFALL_URL;
    let pageNumber = 0;
    let processed = 0;
    let inserted = 0;
    let updated = 0;

    try {
        console.log('Obteniendo cartas de FINAL FANTASY desde Scryfall...');

        while (nextPage) {
            pageNumber += 1;
            console.log(`Página ${pageNumber}...`);
            const page = await getPage(nextPage);

            for (const [index, card] of page.data.entries()) {
                const data = mapCard(card, processed + index);
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
                    create: data,
                    update: data,
                });

                existing ? updated++ : inserted++;
                processed++;
            }

            nextPage = page.has_more ? page.next_page : undefined;
        }

        console.log(`Cartas procesadas: ${processed}`);
        console.log(`Cartas insertadas: ${inserted}`);
        console.log(`Cartas actualizadas: ${updated}`);
        console.log('Importación completada.');
    } finally {
        await prisma.$disconnect();
    }
}

importCards().catch((error: unknown) => {
    console.error('La importación falló:', error);
    process.exitCode = 1;
});