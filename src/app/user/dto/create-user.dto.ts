import { IsEmail, IsIn, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'name should only contain Letters ',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must have letters, numbers and special characters',
  })
  password: string;

  @IsIn(['admin', 'user'])
  role: UserRole = UserRole.USER;
}
