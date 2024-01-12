import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Model } from "mongoose";

import { User } from "../entities/auth.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    // Inyectar el modelo User y el servicio de configuración
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        configService: ConfigService,
    ) {
        // Configurar la estrategia JWT con la clave secreta y el método para extraer el token
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    // Método para validar el payload del token JWT
    async validate(payload: JwtPayload): Promise<User> {

        // Extraer el ID del payload del token
        const { id } = payload;

        // Buscar el usuario en la base de datos por su ID
        const user = await this.userModel.findById(id);

        // Si el usuario no existe o está inactivo, lanza una excepción
        if(!user) throw new UnauthorizedException('Token not valid');
        if(!user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin');
        
        // Retornar el usuario si la validación es exitosa
        return user; 
    }
}
