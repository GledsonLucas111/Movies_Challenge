import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailAlreadyExistsException } from '../../../exceptions/email-already-exists.exception';
import { PostgresErrorCode } from '../../../utils/e-typeorm-error.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(
        this.userRepository.create({
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        }),
      );
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new EmailAlreadyExistsException();
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const usersAdmin = await this.userRepository.find({
      where: { role: UserRole.ADMIN },
    });
    console.log(usersAdmin);
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User = await this.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    try {
      const user: User = await this.findOne(id);

      if (!user) {
        throw new NotFoundException();
      }

      return await this.userRepository.remove(user);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete user. There are rentals associated with this user.',
        );
      }
      throw error;
    }
  }
}
