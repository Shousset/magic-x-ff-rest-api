/**
 * Modelos y Tipos de Datos — Módulo de Colecciones
 * Sintaxis: Angular 18 / TypeScript 5+
 */

export interface Rarity {
  id: number;
  name: string;
}

export interface CardType {
  id: number;
  name: string;
}

export interface Card {
  id: number;
  name: string;
  manaCost: string | null;
  oracleText: string | null;
  power: string | null;
  toughness: string | null;
  setCode: string; // 'FIN' o 'HOB'
  collectorNumber: string;
  artist: string | null;
  imageUrl: string | null;
  displayOrder: number;
  rarity: Rarity;
  cardType: CardType;
}

export interface CollectionEntry {
  id: string;
  userId: string;
  cardId: number;
  quantity: number;
  isFoil: boolean;
  createdAt: string;
  updatedAt: string;
  card: Card;
}

export interface CollectionSummary {
  totalCards: number;
  uniqueCards: number;
  byRarity: Record<string, number>;
}

export interface CreateCollectionEntryDto {
  cardId: number;
  quantity?: number;
  isFoil?: boolean;
}

export interface UpdateCollectionEntryDto {
  quantity?: number;
  isFoil?: boolean;
}
