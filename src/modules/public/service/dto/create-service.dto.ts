import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength, Min } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
