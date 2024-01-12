import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/entities/auth.entity';


@Schema()
export class Shipment extends Document {
    @Prop({ required: true, unique: true, index: true  })
    trackingNumber: string; // Número de seguimiento del envío

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' , required: true}] })
    products: Types.ObjectId[]; // IDs de los productos en el envío

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: User | Types.ObjectId; // Usuario que envía

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    recipient: User | Types.ObjectId; // Usuario destinatario

    @Prop({ default: 'In transit' })
    status: string; // Shipment status, e.g. "In transit", "Delivered".

}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
