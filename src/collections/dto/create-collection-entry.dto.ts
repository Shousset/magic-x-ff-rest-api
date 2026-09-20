import { IsBoolean, IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateCollectionEntryDto {
  @IsInt()
  @IsPositive()
  cardId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  isFoil?: boolean;
}
