import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idService: number;
}
