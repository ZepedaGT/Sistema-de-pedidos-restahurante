import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private pedidosService: PedidosService) {}

  @Get()
  listar() {
    return this.pedidosService.listar();
  }

  @Post()
  crear(@Body() body: any) {
    return this.pedidosService.crear(body);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.pedidosService.cambiarEstado(id, body);
  }
}