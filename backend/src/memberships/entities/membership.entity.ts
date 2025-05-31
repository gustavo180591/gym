import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: number; // En días

  @Column({ type: 'enum', enum: ['monthly', 'yearly', 'custom'] })
  type: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  benefits?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, booking => booking.membership)
  bookings: Booking[];

  @ManyToOne(() => User, user => user.memberships)
  user: User;
}
