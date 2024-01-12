import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password with at least one uppercase letter, one lowercase letter, and one number',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password must include uppercase, lowercase letters, and a number' }
    )
    password: string;

    @ApiProperty({
        example: ['admin', 'user'],
        description: 'Roles assigned to the user',
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    roles?: string[];
}
