import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Routine } from './routine.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'integer' })
  sets: number;

  @Column({ type: 'integer' })
  reps: number;

  @Column({ type: 'integer', nullable: true })
  restTime?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  notes?: Record<string, any>;

  @Column({ type: 'enum', enum: ['weight', 'reps', 'time'] })
  measurementType: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Routine, routine => routine.exercises)
  routine: Routine;
}
