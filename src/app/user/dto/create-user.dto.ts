import { UserEntity } from '../entities/user.entity';

export class CreateUserDto implements UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
}
