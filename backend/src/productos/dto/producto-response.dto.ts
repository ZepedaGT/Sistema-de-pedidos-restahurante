import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductoResponseDto {
  @ApiProperty({ example: 1 })
  id_producto!: number;

  @ApiProperty({ example: 'Wantan' })
  nombre!: string;

  @ApiProperty({ example: 65.69 })
  precio!: number;

  @ApiPropertyOptional({
    example: 'Pollo con verduras y jugos orientales',
    nullable: true,
  })
  descripcion!: string | null;

  @ApiProperty({ example: 1 })
  id_categoria!: number;

  @ApiProperty({
    example: {
      id_categoria: 1,
      nombre: 'Comida China',
    },
  })
  categoria!: {
    id_categoria: number;
    nombre: string;
  };

  @ApiProperty({
    example: [
      {
        id_foto: 1,
        url: 'https://miapp.com/fotos/producto1.jpg',
      },
    ],
  })
  fotos!: {
    id_foto: number;
    url: string;
  }[];
}