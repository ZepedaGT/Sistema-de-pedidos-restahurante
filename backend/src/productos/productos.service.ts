import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.productos.findMany({
      include: {
        categorias: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  crear(body: any) {
    return this.prisma.productos.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio: body.precio,
        imagen: body.imagen,
        disponible: body.disponible ?? true,
        categoria_id: body.categoria_id,
      },
    });
  }
}