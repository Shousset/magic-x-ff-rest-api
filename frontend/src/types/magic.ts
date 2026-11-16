export type Card = {
  id: number;
  name: string;
  manaCost: string | null;
  oracleText: string | null;
  power: string | null;
  toughness: string | null;
  setCode: string;
  collectorNumber: string;
  artist: string | null;
  imageUrl: string | null;
  rarity: { name: string };
  cardType: { name: string };
};

export type CollectionEntry = {
  id: string;
  cardId: number;
  quantity: number;
  isFoil: boolean;
  card: Card;
};

export type CollectionSummary = {
  totalCards: number;
  uniqueCards: number;
  byRarity: Record<string, number>;
};

export type CollectionPage = {
  data: CollectionEntry[];
  meta: { total: number; limit: number; offset: number };
};

export type PublicUser = {
  username: string;
  role: 'ADMINISTRATOR' | 'PLAYER';
};

export type SetInfo = {
  setCode: string;
  name: string;
  totalCards: number;
};

export type CardPage = {
  data: Card[];
  meta: { total: number; limit: number; offset: number };
};
