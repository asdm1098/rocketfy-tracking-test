import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

    @ApiProperty({ 
        example: 'user@example.com', 
        description: 'Email address of the user' 
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ 
        example: 'Password123!', 
        description: 'User password. Must contain at least one uppercase letter, one lowercase letter, and one number' 
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        {
            message: 'Password must include uppercase, lowercase letters, and a number'
        }
    )
    password: string;
}
