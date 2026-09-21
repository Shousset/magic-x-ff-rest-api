"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_service_1 = require("../prisma/prisma.service");
const SCRYFALL_URL = 'https://api.scryfall.com/cards/search?q=set%3Afin&unique=prints&order=set';
function combineFaces(card, field) {
    const value = card[field];
    if (typeof value === 'string' && value.length > 0) {
        return value;
    }
    const values = (card.card_faces ?? [])
        .map((face) => face[field])
        .filter((faceValue) => Boolean(faceValue));
    return values.length > 0 ? values.join(' // ') : null;
}
function mapCard(card, index) {
    const imageUrl = card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null;
    const collectorNumber = card.collector_number;
    const displayOrder = Number.parseInt(collectorNumber, 10);
    return {
        name: card.name,
        manaCost: combineFaces(card, 'mana_cost'),
        oracleText: combineFaces(card, 'oracle_text'),
        power: combineFaces(card, 'power'),
        toughness: combineFaces(card, 'toughness'),
        rarityName: card.rarity,
        cardTypeName: combineFaces(card, 'type_line') ?? 'Unknown',
        setCode: card.set.toUpperCase(),
        collectorNumber,
        artist: card.artist ?? combineFaces(card, 'artist'),
        imageUrl,
        displayOrder: Number.isNaN(displayOrder) ? index : displayOrder,
    };
}
async function getPage(url) {
    const response = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'magic-x-ff-rest-api/1.0' },
    });
    if (!response.ok) {
        throw new Error(`Scryfall responded with HTTP ${response.status}`);
    }
    return response.json();
}
async function importCards() {
    const prisma = new prisma_service_1.PrismaService();
    let nextPage = SCRYFALL_URL;
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
                    create: { ...cardData, rarityId: rarity.id, cardTypeId: cardType.id },
                    update: { ...cardData, rarityId: rarity.id, cardTypeId: cardType.id },
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
    }
    finally {
        await prisma.$disconnect();
    }
}
importCards().catch((error) => {
    console.error('La importación falló:', error);
    process.exitCode = 1;
});
//# sourceMappingURL=import-cards.js.map