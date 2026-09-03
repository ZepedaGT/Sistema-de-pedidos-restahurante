import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductoCrearDto {
  @ApiProperty({ example: 'Wantan' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @ApiProperty({ example: 65.69 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio!: number;

  @ApiPropertyOptional({
    example: 'Pollo con verduras y jugos orientales',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  id_categoria!: number;
}