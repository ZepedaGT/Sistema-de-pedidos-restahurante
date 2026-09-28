import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { PedidosService, UsuarioAuth } from './pedidos.service';

type RequestConUsuario = Request & { user: UsuarioAuth | null };

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private pedidosService: PedidosService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 pedidos por minuto por IP
  @ApiOperation({
    summary: 'Crear pedido (invitado o con sesión)',
    description:
      'Sin token queda como invitado. Con token se asocia al usuario.',
  })
  @ApiResponse({ status: 201, description: 'Pedido creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  crear(@Body() dto: CrearPedidoDto, @Req() req: RequestConUsuario) {
    return this.pedidosService.crear(dto, req.user ?? null);
  }

  @Get('mios')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Historial de pedidos del usuario con sesión' })
  misPedidos(@Req() req: RequestConUsuario) {
    return this.pedidosService.misPedidos(req.user!.id_usuario);
  }

  @Get('seguimiento/:codigo')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'Consultar un pedido por su código de seguimiento' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  seguimiento(@Param('codigo', new ParseUUIDPipe()) codigo: string) {
    return this.pedidosService.seguimiento(codigo);
  }
}