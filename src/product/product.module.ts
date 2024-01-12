import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    AuthModule,
    ConfigModule,
    MongooseModule.forFeature([
      { 
        name: Product.name,
        schema: ProductSchema 
      },
    ]),
  ],
  exports: [ 
    MongooseModule,
  ]

})
export class ProductModule {}
