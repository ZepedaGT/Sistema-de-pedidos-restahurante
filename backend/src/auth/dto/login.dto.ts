import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail()
  correo!: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  password!: string;
}
