import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail()
  correo!: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({ example: 'https://miapp.com/fotos/user1.jpg' })
  @IsOptional()
  foto?: string;
}
