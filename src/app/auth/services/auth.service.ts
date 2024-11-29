import { Injectable } from '@nestjs/common';
import { UserPayload } from '../model/UserPayload';

import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/user/services/user.service';

import * as bcrypt from 'bcrypt';

import { UserToken } from '../model/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async Login(email: string, password: string): Promise<UserToken> {
    const user = await this.validateUser(email, password);

    const payload: UserPayload = {
      username: email,
      sub: user.id,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (passwordIsValid) {
        return {
          ...user,
        };
      }
    }
    throw new Error('Email address or password provided is incorrect.');
  }
}
