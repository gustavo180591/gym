import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from './entities/routine.entity';
import { Exercise } from './entities/exercise.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    const routine = this.routinesRepository.create(createRoutineDto);
    return this.routinesRepository.save(routine);
  }

  async findAll(): Promise<Routine[]> {
    return this.routinesRepository.find();
  }

  async findOne(id: string): Promise<Routine> {
    const routine = await this.routinesRepository.findOne({
      where: { id },
      relations: ['exercises'],
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    return routine;
  }

  async update(id: string, updateRoutineDto: Partial<CreateRoutineDto>): Promise<Routine> {
    const routine = await this.findOne(id);
    Object.assign(routine, updateRoutineDto);
    return this.routinesRepository.save(routine);
  }

  async remove(id: string): Promise<void> {
    const routine = await this.findOne(id);
    await this.routinesRepository.remove(routine);
  }

  async addExercise(routineId: string, createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const routine = await this.findOne(routineId);
    const exercise = this.exercisesRepository.create({
      ...createExerciseDto,
      routine,
    });
    return this.exercisesRepository.save(exercise);
  }

  async removeExercise(exerciseId: string): Promise<void> {
    const exercise = await this.exercisesRepository.findOne({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    await this.exercisesRepository.remove(exercise);
  }
}
