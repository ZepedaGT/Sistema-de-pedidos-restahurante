import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductoCrearDto } from './dto/producto-crear.dto';
import { ProductoResponseDto } from './dto/producto-response.dto';
import 'multer';

import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async crearProducto(
    createProductoDto: ProductoCrearDto,
    foto?: Express.Multer.File,
  ): Promise<ProductoResponseDto> {
    if (!foto) {
      throw new BadRequestException('La foto del producto es obligatoria');
    }

    // Verificar que la categoría exista
    const categoria = await this.prisma.categoria.findUnique({
      where: {
        id_categoria: createProductoDto.id_categoria,
      },
    });

    if (!categoria) {
      throw new NotFoundException(
        'La categoría no existe',
      );
    }

    // Nombre único para la imagen
    const nombreArchivo = `${Date.now()}-${foto.originalname}`;

    // Ruta donde se guardará la imagen
    const ruta = join(
      process.cwd(),
      'uploads',
      'productos',
      nombreArchivo,
    );

    // Guardar imagen
    await writeFile(ruta, foto.buffer);

    // URL que se guardará en la base de datos
    const urlFoto = `/uploads/productos/${nombreArchivo}`;

    // Crear producto y foto
    const producto = await this.prisma.producto.create({
      data: {
        nombre: createProductoDto.nombre,
        precio: createProductoDto.precio,
        descripcion: createProductoDto.descripcion,
        id_categoria: createProductoDto.id_categoria,

        foto_producto: {
          create: {
            url: urlFoto,
          },
        },
      },

      include: {
        categoria: true,
        foto_producto: true,
      },
    });

    return {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      descripcion: producto.descripcion,
      id_categoria: producto.id_categoria,

      categoria: {
        id_categoria: producto.categoria.id_categoria,
        nombre: producto.categoria.nombre,
      },

      fotos: producto.foto_producto.map((foto) => ({
        id_foto: foto.id_foto,
        url: foto.url,
      })),
    };
  }

  async obtenerProductos(): Promise<ProductoResponseDto[]> {
    const productos = await this.prisma.producto.findMany({
      include: {
        categoria: true,
        foto_producto: true,
      },
      orderBy: {
        id_producto: 'desc',
      },
    });

    return productos.map((producto) => ({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      descripcion: producto.descripcion,
      id_categoria: producto.id_categoria,

      categoria: {
        id_categoria: producto.categoria.id_categoria,
        nombre: producto.categoria.nombre,
      },

      fotos: producto.foto_producto.map((foto) => ({
        id_foto: foto.id_foto,
        url: foto.url,
      })),
    }));
  }
}