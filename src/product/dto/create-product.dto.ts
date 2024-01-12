import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Produt Name (unique)',
        nullable: false,
        minLength: 1,
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Produt Description',
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Produt price',
        nullable: false,
        minLength: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({
        description: 'Produt Stock',
        nullable: false,
        minLength: 1
    })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiProperty({
        description: 'User MongoID',
        nullable: false,
    })
    @IsNotEmpty()
    @IsMongoId()
    userId: string;
}
