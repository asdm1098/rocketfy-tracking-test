import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';
import { ShipmentModule } from 'src/shipment/shipment.module';

@Module({
  controllers: [SeedController],
  imports: [
    AuthModule,
    ProductModule,
    ShipmentModule,
  ],
  providers: [SeedService],
  
})
export class SeedModule {}
