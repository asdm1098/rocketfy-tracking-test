import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Shipment } from './entities/shipment.entity';

@ApiTags('Shipments')
@ApiBearerAuth()
@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.vendedor)
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({ status: 201, description: 'Shipment created', type: Shipment })
  async createShipment(
    @GetUser('id') userId: string,
    @Body() createShipmentDto: CreateShipmentDto,
  ) {
    return this.shipmentService.create(userId, createShipmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of shipments' })
  @ApiResponse({ status: 200, description: 'List of shipments', type: [Shipment] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.shipmentService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Find a shipment by term (tracking number or ID)' })
  @ApiParam({ name: 'term', description: 'Tracking Number or ID of the shipment' })
  @ApiResponse({ status: 200, description: 'Shipment details', type: Shipment })
  findOne(@Param('term') term: string) {
    return this.shipmentService.findOne(term);
  }

  @Patch(':term')
  @Auth(ValidRoles.admin, ValidRoles.vendedor)
  @ApiOperation({ summary: 'Update a shipment' })
  @ApiParam({ name: 'term', description: 'Tracking Number or ID of the shipment to update' })
  @ApiResponse({ status: 200, description: 'Shipment updated', type: Shipment })
  update(@Param('term') term: string, @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentService.update(term, updateShipmentDto);
  }
}
