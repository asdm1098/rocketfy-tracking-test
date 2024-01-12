import { IsNotEmpty, IsString, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShipmentDto {
    @ApiProperty({
        description: 'Unique tracking number for the shipment',
        example: 'SH123456789'
    })
    @IsNotEmpty()
    @IsString()
    trackingNumber: string;

    @ApiProperty({
        description: 'Array of product IDs included in the shipment',
        example: ['prod123', 'prod456'],
        type: [String]
    })
    @IsArray()
    @IsMongoId({ each: true })
    products: string[];

    @ApiProperty({
        description: 'User ID of the sender of the shipment',
        example: 'user123'
    })
    @IsNotEmpty()
    @IsMongoId()
    sender: string;

    @ApiProperty({
        description: 'User ID of the recipient of the shipment',
        example: 'user456'
    })
    @IsNotEmpty()
    @IsMongoId()
    recipient: string;
}
