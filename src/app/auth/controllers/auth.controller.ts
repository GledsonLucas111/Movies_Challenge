import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginRequestBody } from '../model/LoginRequestBody';
import { Public } from '../public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  Login(@Body() { email, password }: LoginRequestBody) {
    return this.authService.Login(email, password);
  }
}
