import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { PaymentMethod } from "generated/prisma";

export class CreateDonationDto {

    @ApiProperty({
        description: 'quantity of the donation'
        , example: 150.00
    })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must be a number with up to 2 decimals' })
    @Min(0.01, { message: 'Amount must be greater than 0' })
    amount: number;

    @ApiProperty({ default: 'false' })
    @IsBoolean({ message: 'isAnonymous must be a boolean' })
    @IsOptional()
    isAnonymous?: boolean;

    @ApiPropertyOptional({ description: 'Nombre del donante (si no es anónimo)', example: 'Juan Pérez' })
    @IsOptional()
    @IsString({ message: 'donorName must be a string' })
    donorName?: string;

    @ApiProperty({ example: 'donor@mail.com' })
    @IsOptional()
    @IsString({ message: 'donorEmail must be a string' })
    @IsEmail({}, { message: 'Invalid email format' })
    donorEmail?: string;

    @ApiProperty({ description: 'Método de pago', enum: PaymentMethod, example: PaymentMethod.MERCADO_PAGO })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({ example: 'txn_123456', required: false })
    @IsString()
    @IsOptional()
    transactionCode?: string;

    @ApiPropertyOptional({ description: 'ID del usuario si es registrado', example: 'uuid-v4' })
    @IsString()
    @IsOptional()
    @IsUUID('4', { message: 'userId must be a valid UUID v4' })
    userId?: string;

    @ApiProperty({ description: 'ID de la fundación que recibe la donación', example: 'uuid-v4' })
    @IsString()
    @IsOptional()
    @IsUUID('4', { message: 'foundationId must be a valid UUID v4' })
    foundationId: string;
}
