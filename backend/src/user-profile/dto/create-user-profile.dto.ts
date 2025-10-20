import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserProfileDto {
  @ApiProperty({ description: 'ID of user', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;

  @ApiPropertyOptional({ description: 'descripquion user', example: 'Descripcion de usuario', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'contact phone', example: '+5491123456789' })
  @IsOptional()
  @IsString()
  @Matches(/^\+54\d{10}$/, { message: 'phone must be +54 followed by 10 digits' })
  phone?: string;

  @ApiPropertyOptional({ description: 'address user', example: 'Calle 123' })
  @IsOptional()
  @IsString()
  address?: string;
}
