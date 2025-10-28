import { PartialType } from '@nestjs/mapped-types';
import { CreateFoundationDto } from './create-foundation.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class UpdateFoundationDto extends PartialType(CreateFoundationDto) {
      @ApiPropertyOptional({
    description: 'Nombre actualizado de la fundación',
    minLength: 4,
    maxLength: 100,
    example: 'Fundación Nueva Ejemplo',
  })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción actualizada de la fundación',
    maxLength: 500,
    example: 'Fundación que ahora también ayuda animales en situación de calle.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL del logo actualizado',
    example: 'https://example.com/logo_nuevo.png',
  })
  @Matches(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, { message: 'Logo debe ser una URL válida de imagen' })
  logo_url?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto actualizado',
    example: '+5491123456790',
  })
  @Matches(/^\+54\d{10}$/, { message: 'El teléfono debe ser +54 seguido de 10 dígitos' })
  contact_phone?: string;

  @ApiPropertyOptional({
    description: 'Email de contacto actualizado',
    example: 'contacto@fundacionnuevo.com',
  })
  contact_email?: string;

}
