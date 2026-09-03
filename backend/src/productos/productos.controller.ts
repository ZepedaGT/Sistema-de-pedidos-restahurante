import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductosService } from './productos.service';
import { ProductoCrearDto } from './dto/producto-crear.dto';
import { ProductoResponseDto } from './dto/producto-response.dto';
import 'multer';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida correctamente',
    type: [ProductoResponseDto],
  })
  async obtenerProductos(): Promise<ProductoResponseDto[]> {
    return this.productosService.obtenerProductos();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          example: 'Wantan',
        },
        precio: {
          type: 'number',
          example: 65.69,
        },
        descripcion: {
          type: 'string',
          example: 'Pollo con verduras y jugos orientales',
        },
        id_categoria: {
          type: 'number',
          example: 1,
        },
        foto: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['nombre', 'precio', 'id_categoria', 'foto'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: ProductoResponseDto,
  })
  @UseInterceptors(FileInterceptor('foto'))
  async crearProducto(
    @Body() createProductoDto: ProductoCrearDto,
    @UploadedFile() foto?: Express.Multer.File,
  ): Promise<ProductoResponseDto> {
    return this.productosService.crearProducto(
      createProductoDto,
      foto,
    );
  }
}