import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @ApiProperty({
        default: 5, description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit: number;

    @ApiProperty({
        default: 0, description: 'How many rows do you want to skip'
    })
    @IsOptional()
    // @IsPositive()
    offset: number;
}