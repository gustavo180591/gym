import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async create(createProgressDto: CreateProgressDto): Promise<Progress> {
    const progress = this.progressRepository.create(createProgressDto);
    return this.progressRepository.save(progress);
  }

  async findAll(): Promise<Progress[]> {
    return this.progressRepository.find();
  }

  async findOne(id: string): Promise<Progress> {
    const progress = await this.progressRepository.findOne({
      where: { id },
    });

    if (!progress) {
      throw new NotFoundException('Progress record not found');
    }

    return progress;
  }

  async findByUser(userId: string): Promise<Progress[]> {
    return this.progressRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findByExercise(exerciseId: string): Promise<Progress[]> {
    return this.progressRepository.find({
      where: { exerciseId },
      order: { date: 'DESC' },
    });
  }

  async update(id: string, updateProgressDto: Partial<CreateProgressDto>): Promise<Progress> {
    const progress = await this.findOne(id);
    Object.assign(progress, updateProgressDto);
    return this.progressRepository.save(progress);
  }

  async remove(id: string): Promise<void> {
    const progress = await this.findOne(id);
    await this.progressRepository.remove(progress);
  }
}
