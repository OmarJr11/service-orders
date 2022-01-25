import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
  IsEmpty,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  telephone: string;

  @IsOptional()
  services?: string[];

  @IsEmpty()
  origin?: string;
}
