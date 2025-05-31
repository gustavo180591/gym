import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateRoutineDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: string;

  @IsString()
  @IsOptional()
  goals?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
