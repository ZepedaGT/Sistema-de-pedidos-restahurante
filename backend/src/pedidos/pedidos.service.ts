import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.pedidos.findMany({
      include: {
        usuarios: true,
        detalle_pedido: {
          include: {
            productos: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async crear(body: any) {
    const pedido = await this.prisma.pedidos.create({
      data: {
        usuario_id: body.usuario_id,
        nombre_cliente: body.nombre_cliente,
        telefono: body.telefono,
        direccion: body.direccion,
        total: body.total,
        estado: 'pendiente',
      },
    });

    for (const item of body.detalle) {
      await this.prisma.detalle_pedido.create({
        data: {
          pedido_id: pedido.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio: item.precio,
          subtotal: item.subtotal,
        },
      });
    }

    return {
      mensaje: 'Pedido creado correctamente',
      pedido_id: pedido.id,
    };
  }

  cambiarEstado(id: number, body: any) {
    return this.prisma.pedidos.update({
      where: { id },
      data: {
        estado: body.estado,
      },
    });
  }
}