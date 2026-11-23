export class UpdateCardDto {
  name?: string;
  manaCost?: string | null;
  type?: string;
  oracleText?: string | null;
  power?: string | null;
  toughness?: string | null;
  rarity?: string;
  setCode?: string;
  collectorNumber?: string;
  artist?: string | null;
  imageUrl?: string | null;
  displayOrder?: number;
}
