export class CreateCardDto {
  name!: string;
  manaCost?: string | null;
  type!: string;
  oracleText?: string | null;
  power?: string | null;
  toughness?: string | null;
  rarity!: string;
  setCode?: string | null;
  collectorNumber!: string;
  artist?: string | null;
  imageUrl?: string | null;
  displayOrder?: number;
}
