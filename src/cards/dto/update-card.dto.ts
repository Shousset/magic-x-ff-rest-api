import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @Matches(/\S/)
  name?: string;

  @IsOptional()
  @IsString()
  manaCost?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  type?: string;

  @IsOptional()
  @IsString()
  oracleText?: string | null;

  @IsOptional()
  @IsString()
  power?: string | null;

  @IsOptional()
  @IsString()
  toughness?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  rarity?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{2,5}$/)
  setCode?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  collectorNumber?: string;

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
