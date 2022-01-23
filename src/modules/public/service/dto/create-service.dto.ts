import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;
}
