import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './entities/shipment.entity';
import { ProductModule } from 'src/product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService],
  imports: [
    AuthModule,
    ProductModule,
    ConfigModule,
    MongooseModule.forFeature([
      { 
        name: Shipment.name,
        schema: ShipmentSchema 
      },
    ]),
  ],
  exports: [
    MongooseModule,
  ]
})
export class ShipmentModule {}
