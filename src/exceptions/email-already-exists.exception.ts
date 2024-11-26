import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super('User with this email already exists', HttpStatus.CONFLICT);
  }
}
