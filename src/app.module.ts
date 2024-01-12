import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './common/config/env.config';
import { JoiValidationSchema } from './common/config/joi.validation';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema,
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    //Conexión mongoDB
    MongooseModule.forRoot( process.env.MONGODB ),
    CommonModule,
    SeedModule,
    AuthModule,
    ProductModule,
    ShipmentModule
  ],

})
export class AppModule {}