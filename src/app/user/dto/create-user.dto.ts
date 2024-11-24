import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]*$/, { message: 'name should only contain Letters ' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must have letters, numbers and special characters',
  })
  password: string;
}
