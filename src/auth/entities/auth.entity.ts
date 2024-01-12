import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';

// Este decorador define que `User` es un esquema de Mongoose
@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ 
        default: ['vendedor', 'cliente'],
        // enum: ['admin', 'cliente', 'vendedor']
    })
    roles: string[]; // 'admin', 'cliente', 'vendedor'
    
    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    products: Product[] | Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Shipment'}] })
    shipments: Types.ObjectId[]; // IDs de los productos en el envío
}

// Exporta el modelo `Auth` que es la representación de tu esquema en MongoDB
export const UserSchema = SchemaFactory.createForClass(User);

