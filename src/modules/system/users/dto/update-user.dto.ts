import { IsOptional, IsPhoneNumber, IsEmail } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  telephone?: string;
}
