import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, tipo_entrega } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

export interface UsuarioAuth {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  foto: string | null;
}

const DETALLE_SELECT = {
  cantidad: true,
  nota: true,
  precio_unitario: true,
  producto: { select: { id_producto: true, nombre: true } },
} satisfies Prisma.pedido_productoSelect;

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearPedidoDto, usuario: UsuarioAuth | null) {
    // 1. Productos: el precio SIEMPRE viene de la base, nunca del cliente
    const ids = [...new Set(dto.items.map((i) => i.id_producto))];

    const productos = await this.prisma.producto.findMany({
      where: { id_producto: { in: ids } },
      select: { id_producto: true, precio: true },
    });

    if (productos.length !== ids.length) {
      throw new BadRequestException('Uno o más productos no existen');
    }

    const mapa = new Map(productos.map((p) => [p.id_producto, p]));

    let total = new Prisma.Decimal(0);
    const detalles = dto.items.map((item) => {
      const producto = mapa.get(item.id_producto)!;
      total = total.plus(producto.precio.mul(item.cantidad));
      return {
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        nota: item.nota || null,
        precio_unitario: producto.precio,
      };
    });

    // 2. Dirección según tipo de entrega
    let idDireccion: number | null = null;
    let direccionEntrega: string | null = null;

    if (dto.tipo_entrega === tipo_entrega.DOMICILIO) {
      if (usuario && dto.id_direccion) {
        const guardada = await this.prisma.direccion.findFirst({
          where: {
            id_direccion: dto.id_direccion,
            id_usuario: usuario.id_usuario, // debe ser suya
          },
        });
        if (!guardada) {
          throw new NotFoundException('Dirección no encontrada');
        }
        idDireccion = guardada.id_direccion;
        direccionEntrega = dto.direccion_entrega || guardada.lugar;
      } else {
        direccionEntrega = dto.direccion_entrega || null;
      }

      if (!direccionEntrega) {
        throw new BadRequestException(
          'La dirección de entrega es obligatoria para pedidos a domicilio',
        );
      }
    }

    // 3. Crear pedido con sus detalles en una sola operación (transaccional)
    const pedido = await this.prisma.pedido.create({
      data: {
        id_usuario: usuario?.id_usuario ?? null,
        id_direccion: idDireccion,
        nombre_cliente: dto.nombre_cliente,
        telefono_cliente: dto.telefono_cliente,
        correo_cliente: dto.correo_cliente || null,
        tipo_entrega: dto.tipo_entrega,
        direccion_entrega: direccionEntrega,
        notas: dto.notas || null,
        total,
        pedido_producto: { create: detalles },
      },
      select: {
        id_pedido: true,
        codigo_seguimiento: true,
        estado: true,
        tipo_entrega: true,
        total: true,
        fecha: true,
        pedido_producto: { select: DETALLE_SELECT },
      },
    });

    return pedido;
  }

  /** Consulta pública por código. No expone teléfono, correo ni dirección. */
  async seguimiento(codigo: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { codigo_seguimiento: codigo },
      select: {
        codigo_seguimiento: true,
        nombre_cliente: true,
        estado: true,
        tipo_entrega: true,
        total: true,
        fecha: true,
        pedido_producto: { select: DETALLE_SELECT },
      },
    });

    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return pedido;
  }

  /** Historial del usuario con sesión */
  misPedidos(id_usuario: number) {
    return this.prisma.pedido.findMany({
      where: { id_usuario },
      orderBy: { fecha: 'desc' },
      take: 50,
      select: {
        id_pedido: true,
        codigo_seguimiento: true,
        estado: true,
        tipo_entrega: true,
        direccion_entrega: true,
        total: true,
        fecha: true,
        pedido_producto: { select: DETALLE_SELECT },
      },
    });
  }
}