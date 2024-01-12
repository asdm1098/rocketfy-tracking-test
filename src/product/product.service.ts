import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { User } from 'src/auth/entities/auth.entity';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,

) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    
    try {
      createProductDto.name = createProductDto.name.toLowerCase();
        
      const user = await this.userModel.findById(createProductDto.userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${createProductDto.userId} not found`);
        }
  
        const product = new this.productModel({
            ...createProductDto,
            user: user._id
        });
  
        await product.save();
  
        user.products.push(product._id);
        await user.save();
  
        return product;
      
    } catch (error) {
      this.handleExceptions( error );
      
    }
  }

  findAll( paginationDto: PaginationDto ) {
    const { limit = this.configService.get('default_limit'), offset = 0 } = paginationDto;
    return this.productModel.find()
      .limit( limit )
      .skip( offset )
      .sort( { name: 1 } )
      .select( '-__v' );
  }

  async findOne(term: string): Promise<Product | undefined> {
      
    let product: Product;
    
    product = await this.productModel.findOne({ name: term.toLocaleLowerCase().trim() });

    if ( !product && isValidObjectId( term ) ) {
      product = await this.productModel.findById( term );
    }

    if ( !product ) throw new NotFoundException(`The mail or ID ${ term } is not registered in the database.`);
    if(!product.isActive) throw new UnauthorizedException('Product is inactive, talk with an admin');

    return product;
  }

  async update(term: string, updateProductDto: UpdateProductDto) {

    try {
      const product = await this.findOne( term );
  
      if ( updateProductDto.name ) updateProductDto.name = updateProductDto.name.toLowerCase();
      
      await product.updateOne( updateProductDto );
  
      if ( !product ) throw new NotFoundException(`The name or ID ${ term } is not registered in the database.`);
  
      //Devolver product actualizado
      return { ...product.toJSON(), ...updateProductDto};
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException(`The product with ID ${ id } is not registered in the database.`);
    if(!product.isActive) throw new UnauthorizedException('Product is inactive, talk with an admin');

    product.isActive = false;
    await product.save();

    return;
  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`The name is already registered in another Product: ${ JSON.stringify( error.keyValue ) }`);
    } else {
        console.log( error );
        throw new InternalServerErrorException(`Product could not be created/upgraded, check server logs`);
    }
  }
}
