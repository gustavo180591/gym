import { IsString, IsTime, IsInt, IsPositive, IsEnum } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsTime()
  startTime: string;

  @IsTime()
  endTime: string;

  @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  dayOfWeek: string;

  @IsInt()
  @IsPositive()
  maxParticipants: number;

  @IsString()
  @IsOptional()
  equipment?: string;
}
