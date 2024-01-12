import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/entities/auth.entity';

@Schema()
export class Product extends Document {
    @ApiProperty({
        example: 'Product 1 example',
        description: 'Product name',
        uniqueItems: true
    })
    @Prop({ required: true, unique: true, index: true })
    name: string;

    @ApiProperty({
        example: 'Product 1 description',
        description: 'Product description',
    })
    @Prop({ required: true })
    description: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Prop({ default: 0 })
    price: number;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
    })
    @Prop({ default: 0})
    stock: number;

    @ApiProperty({
        example: '5f8f0b5f8f0b5f8f0b5f8f0',
        description: 'User MongoID',
    })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User | Types.ObjectId;

    @ApiProperty({
        example: true,
        description: 'Product avaliable',
    })
    @Prop({ default: true })
    isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
