import { Request } from 'express';
import { User } from 'src/app/user/entity/user.entity';

export interface AuthRequest extends Request {
  principal: User;
}
