import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exercise } from '../../routines/entities/exercise.entity';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bodyFatPercentage?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  muscleMass?: number;

  @Column({ type: 'jsonb', nullable: true })
  measurements?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  notes?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.progress)
  user: User;

  @ManyToOne(() => Exercise, exercise => exercise.progress)
  exercise?: Exercise;
}
