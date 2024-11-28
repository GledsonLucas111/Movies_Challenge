import { IsString, MinLength } from 'class-validator';

export class LoginRequestBody {
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
