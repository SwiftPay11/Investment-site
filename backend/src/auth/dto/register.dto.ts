import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  country: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  gender: string;

  @IsString()
  dob: string;
}
