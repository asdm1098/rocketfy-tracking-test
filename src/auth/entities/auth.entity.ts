import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';

// Este decorador define que `User` es un esquema de Mongoose
@Schema()
export class User extends Document {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    @Prop({ required: true })
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'The unique email address of the user' })
    @Prop({ required: true, unique: true, index: true })
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'The hashed password of the user' })
    @Prop({ required: true })
    password: string;

    @ApiProperty({ 
        example: ['vendedor', 'cliente'], 
        description: 'Roles assigned to the user', 
        enum: ['admin', 'cliente', 'vendedor'],
        default: ['vendedor', 'cliente']
    })
    @Prop({ 
        default: ['vendedor', 'cliente'],
        // enum: ['admin', 'cliente', 'vendedor']
    })
    roles: string[]; // 'admin', 'cliente', 'vendedor'
    
    @ApiProperty({ example: true, description: 'Indicates whether the user is active or not' })
    @Prop({ default: true })
    isActive: boolean;

    @ApiProperty({ 
        type: [String], 
        description: 'List of product IDs associated with the user' 
    })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    products: Product[] | Types.ObjectId[];

    @ApiProperty({ 
        type: [String], 
        description: 'List of shipment IDs associated with the user' 
    })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Shipment'}] })
    shipments: Types.ObjectId[];
}

// Exporta el modelo `Auth` que es la representación de tu esquema en MongoDB
export const UserSchema = SchemaFactory.createForClass(User);

