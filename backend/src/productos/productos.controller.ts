import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Get()
  listar() {
    return this.productosService.listar();
  }

  @Post()
  crear(@Body() body: any) {
    return this.productosService.crear(body);
  }
}