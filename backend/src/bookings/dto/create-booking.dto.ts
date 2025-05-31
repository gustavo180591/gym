import { IsDate, IsTime, IsOptional, IsString } from 'class-validator';
import { Class } from '../../classes/entities/class.entity';
import { Membership } from '../../memberships/entities/membership.entity';

export class CreateBookingDto {
  @IsDate()
  date: Date;

  @IsTime()
  startTime: string;

  @IsTime()
  endTime: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  classId?: string;

  @IsOptional()
  membershipId?: string;
}
