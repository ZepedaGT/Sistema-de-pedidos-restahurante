import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { tipo_entrega } from '@prisma/client';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ItemPedidoDto {
  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_producto!: number;

  @ApiProperty({ example: 2, minimum: 1, maximum: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  cantidad!: number;

  @ApiPropertyOptional({ example: 'Sin cebolla' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(trim)
  nota?: string;
}

export class CrearPedidoDto {
  @ApiProperty({ example: 'María López' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(trim)
  nombre_cliente!: string;

  @ApiProperty({ example: '50233330000' })
  @Matches(/^[0-9+\-\s]{8,20}$/, {
    message: 'El teléfono debe tener entre 8 y 20 dígitos',
  })
  @Transform(trim)
  telefono_cliente!: string;

  @ApiPropertyOptional({ example: 'maria@correo.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  @Transform(trim)
  correo_cliente?: string;

  @ApiProperty({ enum: tipo_entrega, example: tipo_entrega.DOMICILIO })
  @IsEnum(tipo_entrega)
  tipo_entrega!: tipo_entrega;

  @ApiPropertyOptional({
    example: '12 calle 3-45, zona 10',
    description: 'Obligatoria si es DOMICILIO (salvo que mandes id_direccion)',
  })
  @ValidateIf((o: CrearPedidoDto) => o.direccion_entrega !== undefined)
  @IsString()
  @MaxLength(255)
  @Transform(trim)
  direccion_entrega?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Solo para usuarios con sesión: dirección guardada',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_direccion?: number;

  @ApiPropertyOptional({ example: 'Tocar el timbre dos veces' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(trim)
  notas?: string;

  @ApiProperty({ type: [ItemPedidoDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  items!: ItemPedidoDto[];
}