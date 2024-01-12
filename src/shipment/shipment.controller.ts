import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Shipments')
@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @Auth( ValidRoles.admin, ValidRoles.vendedor )
  async createShipment(
    @GetUser('id') userId: string, // Extraer el ID del usuario del token
    @Body() createShipmentDto: CreateShipmentDto,
  ) {
    return this.shipmentService.create(userId, createShipmentDto);
  }


  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    // console.log( paginationDto );
    return this.shipmentService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.shipmentService.findOne(term);
  }
  
  @Patch(':term')
  @Auth( ValidRoles.admin, ValidRoles.vendedor )
  update(@Param('term') term: string, @Body() updateShipmentDto: UpdateShipmentDto) {    
    return this.shipmentService.update(term, updateShipmentDto);
  }
  
}