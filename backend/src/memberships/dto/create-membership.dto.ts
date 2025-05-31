import { IsString, IsDecimal, IsInt, IsPositive, IsEnum } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  name: string;

  @IsDecimal()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  duration: number;

  @IsEnum(['monthly', 'yearly', 'custom'])
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  benefits?: string;
}
