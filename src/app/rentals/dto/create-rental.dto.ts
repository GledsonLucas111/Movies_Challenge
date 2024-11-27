import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  userId: string;

  @IsString()
  movieId: string;

  @IsDate()
  @Type(() => Date)
  rentalDate: Date;

  @IsDate()
  @Type(() => Date)
  returnDate: Date;

  @IsBoolean()
  @IsOptional()
  isReturned: boolean;
}
