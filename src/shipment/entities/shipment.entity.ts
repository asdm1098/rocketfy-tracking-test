import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/auth.entity';

@Schema()
export class Shipment extends Document {
    @ApiProperty({
        example: 'SH123456789',
        description: 'Unique tracking number for the shipment'
    })
    @Prop({ required: true, unique: true, index: true })
    trackingNumber: string;

    @ApiProperty({
        example: ['60d0fe4f5311236168a109ca', '60d0fe4f5311236168a109cb'],
        description: 'List of product IDs included in the shipment',
        type: [String]
    })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product', required: true }] })
    products: Types.ObjectId[];

    @ApiProperty({
        example: '60d0fe4f5311236168a109cc',
        description: 'User ID of the sender of the shipment'
    })
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: User | Types.ObjectId;

    @ApiProperty({
        example: '60d0fe4f5311236168a109cd',
        description: 'User ID of the recipient of the shipment'
    })
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    recipient: User | Types.ObjectId;

    @ApiProperty({
        example: 'In transit',
        description: 'Current status of the shipment'
    })
    @Prop({ default: 'In transit' })
    status: string;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
