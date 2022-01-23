import {
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  telephone: string;

  @IsOptional()
  services?: string[];
}
