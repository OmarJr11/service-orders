import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceRequestDto {
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idTicket: number;
}
