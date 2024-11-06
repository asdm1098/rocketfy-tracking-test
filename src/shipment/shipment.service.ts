import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { User } from 'src/auth/entities/auth.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, createShipmentDto: CreateShipmentDto) {

    try {
      const { recipient, products } = createShipmentDto;
      // Convertir el userId a un objeto ObjectId
      createShipmentDto.trackingNumber = createShipmentDto.trackingNumber.toUpperCase();
      const objectId = new Types.ObjectId(userId);
      const recipientId = new Types.ObjectId(createShipmentDto.sender);
      // Realizar la consulta y obtener los productos
      const userProducts = await this.productModel.find({
        _id: { $in: products },
        user: objectId 
      });
      
      // Verificar si el número de productos obtenidos coincide con los solicitados
      if (userProducts.length !== products.length) {
          throw new UnauthorizedException('You do not have permission to send one or more of the selected products.');
      }
  
      // Validar que el destinatario esté activo
      const recipientUser = await this.userModel.findById(recipient);
      if (!recipientUser || !recipientUser.isActive) {
          throw new NotFoundException('The recipient is not active or does not exist.');
      }
  
      // Crear el envío
      const shipment = new this.shipmentModel({
          ...createShipmentDto,
          recipient: recipientId,
          sender: objectId,
      });
      await shipment.save();
      // Actualizar el documento del usuario agregando el ID del envío a la lista de envíos
      await this.userModel.findByIdAndUpdate(userId, {
        $push: { shipments: shipment._id }
      });
  
      await this.userModel.findByIdAndUpdate( createShipmentDto.recipient, {
        $push: { shipments: shipment._id }
      });
    
      return shipment;
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }


  findAll( paginationDto: PaginationDto ) {
    const { limit = this.configService.get('default_limit'), offset = 0 } = paginationDto;
    return this.shipmentModel.find()
      .limit( limit )
      .skip( offset )
      .select( '-__v' );
  }

  async findOne(term: string): Promise<Shipment | undefined> {
      
    let shipment: Shipment;
    
    shipment = await this.shipmentModel.findOne({ trackingNumber: term.toLocaleUpperCase().trim() });

    if ( !shipment && isValidObjectId( term ) ) {
      shipment = await this.shipmentModel.findById( term );
    }

    if ( !shipment ) throw new NotFoundException(`The trackingNumber or ID ${ term } is not registered in the database.`);

    return shipment;
  }

  async update(term: string, updateShipmentDto: UpdateShipmentDto) {    
    try {
      const shipment = await this.findOne( term );
      
      if ( updateShipmentDto.trackingNumber ) updateShipmentDto.trackingNumber = updateShipmentDto.trackingNumber.toUpperCase();
      
      await shipment.updateOne( updateShipmentDto );
  
      if ( !shipment ) throw new NotFoundException(`The name or ID ${ term } is not registered in the database.`);
  
      //Devolver shipment actualizado
      return { ...shipment.toJSON(), ...updateShipmentDto};
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`The trackingNumber is already registered in another Shipment: ${ JSON.stringify( error.keyValue ) }`);
    } else {
        console.log( error );
        throw new InternalServerErrorException(`Shipment could not be created/upgraded, check server logs`);
    }
  }

}
