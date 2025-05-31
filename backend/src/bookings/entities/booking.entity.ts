import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
import { Membership } from '../../memberships/entities/membership.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'boolean', default: true })
  isCancelled: boolean;

  @Column({ type: 'boolean', default: false })
  hasAttended: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.bookings)
  user: User;

  @ManyToOne(() => Class, class => class.bookings)
  class: Class;

  @ManyToOne(() => Membership, membership => membership.bookings)
  membership: Membership;
}
