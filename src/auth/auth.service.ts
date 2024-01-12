import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/auth.entity';
import { Model, isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name )
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const name = createUserDto.name.toLowerCase();
      const passwordHashed = bcrypt.hashSync(createUserDto.password, 10);
  
      const user = new this.userModel({
        ...userData,
        name, 
        password: passwordHashed
      });
  
      await user.save();
  
      // Convertir el documento Mongoose a un objeto JavaScript plano
      const userObject = user.toObject();
  
      // Eliminar los campos no deseados del objeto
      delete userObject.password;
      delete userObject.__v;
  
      // Retornar el objeto modificado con el JWT
      return {
        ...userObject,
        token: this.getJwtToken({ id: user.id })
      };
  
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
  
    // Seleccionar solo los campos email y password, excluyendo el _id
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).select('email password _id');
  
    if (!user) {
      throw new UnauthorizedException(`Credentials are not valid (email)`);
    }
  
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(`Credentials are not valid (password)`);
    }
  
    // Convertir el documento Mongoose a un objeto JavaScript plano
    const userObject = user.toObject();
  
    // Eliminar el campo de contraseña del objeto
    delete userObject.password;
  
    // Retornar el objeto usuario con el token JWT
    return {
      ...userObject,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async checkAuthStatus(user: User) {
    // Realizar una consulta para obtener el usuario excluyendo los campos no deseados
    const userObject = await this.userModel
      .findById(user.id)
      .select('-password -__v -products -shipments')
      .lean();
  
    // Retornar el objeto usuario con el token JWT
    return {
      ...userObject,
      token: this.getJwtToken({ id: user.id })
    };
  }  

  findAll( paginationDto: PaginationDto ) {

    const { limit = this.configService.get('default_limit'), offset = 0 } = paginationDto;
    return this.userModel.find()
      .limit( limit )
      .skip( offset )
      .sort( { name: 1 } )
      .select( '-__v -password' );
  }

  async findOne(term: string): Promise<User | undefined> {
    
    let user: User;
    
    user = await this.userModel.findOne({ email: term });

    if ( !user && isValidObjectId( term ) ) {
      user = await this.userModel.findById( term );
    }

    if ( !user ) throw new NotFoundException(`El correo o ID ${ term } no se encuentra registrado en la base de datos.`);

    return user;
  }

  async update(term: string, updateUserDto: UpdateUserDto) {

    try {
      const user = await this.findOne( term );
  
      if ( updateUserDto.name ) updateUserDto.name = updateUserDto.name.toLowerCase();
      
      await user.updateOne( updateUserDto );
  
      if ( !user ) throw new NotFoundException(`El correo o ID ${ term } no se encuentra registrado en la base de datos.`);
  
      //Devolver user actualizado
      return { ...user.toJSON(), ...updateUserDto};
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne( { _id: id } );
    if ( deletedCount === 0 ) throw new NotFoundException(`El usuario con ID ${ id } no se encuentra registrado en la base de datos.`);
    return;
  }


  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`El correo ya se encuentra registrado con otro Usuario: ${ JSON.stringify( error.keyValue ) }`);
    } else {
        console.log( error );
        throw new InternalServerErrorException(`No se pudo crear el usuario, verifica logs del server`);
    }
  }

  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;
    
  }

}
