import {
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  telephone: string;

  @IsNotEmpty()
  @MaxLength(20)
  type: string;

  @IsOptional()
  services?: string[];
}
