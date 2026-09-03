import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductosModule} from './productos/productos.module'

@Module({
  imports: [AuthModule, ProductosModule],
})
export class AppModule {}
