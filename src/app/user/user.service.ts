import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { EmailAlreadyExistsException } from '../../exceptions/email-already-exists.exception';
import { PostgresErrorCode } from '../../utils/e-typeorm-error.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(
        this.userRepository.create({ id: randomUUID(), ...createUserDto }),
      );
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new EmailAlreadyExistsException();
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user: User = await this.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user: User = await this.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRepository.remove(user);
  }
}
