import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { Rental } from '../entities/rental.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rantalsRepository: Repository<Rental>,
  ) {}

  async create(dto: CreateRentalDto) {
    return await this.rantalsRepository.save(
      this.rantalsRepository.create({ id: randomUUID(), ...dto }),
    );
  }

  async findAll(): Promise<Rental[]> {
    return await this.rantalsRepository.find();
  }

  async findOne(id: string): Promise<Rental> {
    return await this.rantalsRepository.findOne({ where: { id } });
  }
}
