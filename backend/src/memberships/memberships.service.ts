import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const membership = this.membershipsRepository.create(createMembershipDto);
    return this.membershipsRepository.save(membership);
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipsRepository.find();
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipsRepository.findOne({
      where: { id },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return membership;
  }

  async update(id: string, updateMembershipDto: Partial<CreateMembershipDto>): Promise<Membership> {
    const membership = await this.findOne(id);
    Object.assign(membership, updateMembershipDto);
    return this.membershipsRepository.save(membership);
  }

  async remove(id: string): Promise<void> {
    const membership = await this.findOne(id);
    await this.membershipsRepository.remove(membership);
  }
}
