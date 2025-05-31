import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'member',
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: {
        password: false,
        refreshToken: false,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: {
        password: false,
        refreshToken: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        password: false,
        refreshToken: false,
      },
    });
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;

    return bcrypt.compare(password, user.password);
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.findOne(id);
    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
  }

  async removeRefreshToken(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.refreshToken = null;
    await this.usersRepository.save(user);
  }
}
