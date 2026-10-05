import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @Matches(/\S/)
  name!: string;

  @IsOptional()
  @IsString()
  manaCost?: string | null;

  @IsString()
  @Matches(/\S/)
  type!: string;

  @IsOptional()
  @IsString()
  oracleText?: string | null;

  @IsOptional()
  @IsString()
  power?: string | null;

  @IsOptional()
  @IsString()
  toughness?: string | null;

  @IsString()
  @Matches(/\S/)
  rarity!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{2,5}$/)
  setCode?: string | null;

  @IsString()
  @Matches(/\S/)
  collectorNumber!: string;

  @IsOptional()
  @IsString()
  artist?: string | null;

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  imageUrl?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
