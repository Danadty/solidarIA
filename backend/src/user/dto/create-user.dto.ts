import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

enum UserRole {
    USER = 'USER',
    FOUNDATION = 'FOUNDATION',
    ADMIN = 'ADMIN',
}

export class CreateUserDto {


    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;


    @ApiProperty({ example: 'john@mail.com', description: 'User email address' })
    @IsEmail({}, { message: 'Invalid email format' })
    @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
    email: string;

    @ApiProperty({
        example: 'P@ssw0rd123',
        description:
            'Secure password (min 8 chars, includes uppercase, lowercase, number, and special symbol)',
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }) //expresion regular
    password: string;
    
    @ApiProperty({ enum: [UserRole.USER, UserRole.FOUNDATION], default: UserRole.USER, description: 'User role' })
    @IsOptional()
    @IsEnum(UserRole, {
        message: 'Role must be one of: USER, FOUNDATION',
    })
    role: UserRole;
}
