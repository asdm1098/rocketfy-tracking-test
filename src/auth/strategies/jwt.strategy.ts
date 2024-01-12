import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Model } from "mongoose";

import { User } from "../entities/auth.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    
    constructor(
        @InjectModel( User.name )
        private readonly userModel: Model<User>,
        configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }
    async validate( payload: JwtPayload ): Promise <User> {

        const { id } = payload;
        const user = await this.userModel.findById({ _id: id });

        if(!user) throw new UnauthorizedException('Token not valid');
        if(!user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin');
        
        return user; 
    }
}