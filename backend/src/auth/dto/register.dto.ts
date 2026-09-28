import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail()
  @MaxLength(150)
  correo!: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @MinLength(6)
  @MaxLength(72)
  password!: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ example: 'https://miapp.com/fotos/user1.jpg' })
  @IsOptional()
  @MaxLength(255)
  foto?: string;
}