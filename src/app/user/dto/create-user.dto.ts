import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z]*$/, { message: 'name should only contain Letters ' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must have letters, numbers and special characters',
  })
  password: string;
}
