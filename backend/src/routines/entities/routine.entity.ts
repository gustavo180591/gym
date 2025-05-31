import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exercise } from './exercise.entity';

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ['beginner', 'intermediate', 'advanced'] })
  difficulty: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  goals?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  notes?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.routines)
  user: User;

  @OneToMany(() => Exercise, exercise => exercise.routine)
  exercises: Exercise[];
}
