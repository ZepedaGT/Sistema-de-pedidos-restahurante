import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  nombre!: string;

  @IsEmail()
  correo!: string;

  @MinLength(6)
  password!: string;

  @IsOptional()
  telefono?: string;

  @IsOptional()
  foto?: string;
}
