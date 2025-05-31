import { IsString, IsInt, IsPositive, IsEnum, IsOptional } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  sets: number;

  @IsInt()
  @IsPositive()
  reps: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  restTime?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(['weight', 'reps', 'time'])
  measurementType: string;
}
