import { IsDate, IsOptional, IsDecimal, IsString } from 'class-validator';

export class CreateProgressDto {
  @IsDate()
  date: Date;

  @IsDecimal()
  @IsOptional()
  weight?: number;

  @IsDecimal()
  @IsOptional()
  bodyFatPercentage?: number;

  @IsDecimal()
  @IsOptional()
  muscleMass?: number;

  @IsString()
  @IsOptional()
  measurements?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
