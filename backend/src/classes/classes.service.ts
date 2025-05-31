import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const classEntity = this.classesRepository.create(createClassDto);
    return this.classesRepository.save(classEntity);
  }

  async findAll(): Promise<Class[]> {
    return this.classesRepository.find();
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classesRepository.findOne({
      where: { id },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    return classEntity;
  }

  async update(id: string, updateClassDto: Partial<CreateClassDto>): Promise<Class> {
    const classEntity = await this.findOne(id);
    Object.assign(classEntity, updateClassDto);
    return this.classesRepository.save(classEntity);
  }

  async remove(id: string): Promise<void> {
    const classEntity = await this.findOne(id);
    await this.classesRepository.remove(classEntity);
  }
}
