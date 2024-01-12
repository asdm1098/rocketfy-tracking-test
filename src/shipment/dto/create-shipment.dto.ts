import { IsNotEmpty, IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateShipmentDto {
    @IsNotEmpty()
    @IsString()
    trackingNumber: string;

    @IsArray()
    @IsMongoId({ each: true })
    products: string[];

    @IsNotEmpty()
    @IsMongoId()
    sender: string;

    @IsNotEmpty()
    @IsMongoId()
    recipient: string;
}
