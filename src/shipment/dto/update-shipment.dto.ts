import { PartialType } from '@nestjs/swagger';
import { CreateShipmentDto } from './create-shipment.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {
    @IsOptional()
    @IsString()
    status?: string;
}
