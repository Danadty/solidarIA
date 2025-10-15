import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateFoundationDto {

  @ApiProperty({ 
    description: 'Nombre de la fundación',
    minLength: 4,
    maxLength: 100,
    example: 'Fundación Ayuda'
  })
  @IsString({message: 'Name must be a string'})
  @MinLength(4,{message: 'Name must be at least 4 characters'})
  @MaxLength(100,{message: 'Name must be at most 100 characters'})
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  name: string;

  @ApiProperty({
    description: 'Descripción de la fundación',
    maxLength: 500,
    example: 'Fundación dedicada a ayudar personas en situación de vulnerabilidad.'
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must be at most 500 characters' })
  description: string;

  @ApiProperty({
    description: 'URL logo',
    example: 'https://example.com/logo.png'
  })
  @IsString({ message: 'Logo URL must be a string' })
  @Matches(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, { message: 'Logo debe ser una URL válida de imagen' })
  logo_url: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+5491123456789'
  })
  @IsString({ message: 'Contact phone must be a string' })
  @Matches(/^\+54\d{10}$/, { message: 'El teléfono debe ser +54 seguido de 10 dígitos' })
  contact_phone: string;

  @ApiProperty({
    description: 'Email de contacto',
    example: 'contacto@fundacion.com'
  })
  @IsEmail({}, { message: 'Contact email must be a valid email address' })
  contact_email: string;
  
  @ApiProperty({
    description: 'ID del usuario propietario de la fundación',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;
}
