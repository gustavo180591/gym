import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  MEMBER = 'member',
  RECEPTIONIST = 'receptionist'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
