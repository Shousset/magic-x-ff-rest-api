import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCollectionEntryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  isFoil?: boolean;
}
