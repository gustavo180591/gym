import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingsRepository.create(createBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: Partial<CreateBookingDto>): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }

  async markAsAttended(id: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.hasAttended = true;
    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.isCancelled = true;
    return this.bookingsRepository.save(booking);
  }
}
