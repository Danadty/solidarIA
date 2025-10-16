import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateCampaignDto {

    @ApiProperty({
        example: 'Campaign clothes',
        description: 'Campaign title',
        maxLength: 100,
        minLength: 4,
    })
    @IsString({ message: 'Title must be a string' })
    @MinLength(4, { message: 'Title must be at least 4 characters' })
    @MaxLength(100, { message: 'Title must be at most 100 characters' })
    title: string;

    @ApiPropertyOptional({
        example: 'Campaign clothes description',
        description: 'Campaign description',
        maxLength: 500,
        minLength: 4,
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MaxLength(500, { message: 'Description must be at most 500 characters' })
    description?: string;

    @ApiPropertyOptional({
        example: 'https://example.com/image.png',
        description: 'Campaign image (jpg, png, gif, jepg)',
        maxLength: 500,
        minLength: 4,
    })
    @IsOptional()
    @IsString({ message: 'Image URL must be a string' })
    @Matches(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, { message: 'Image URL must be a valid URL' })
    imageUrl?: string;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Campaign start date',
    })
    @IsDateString({},{ message: 'startDate must be a valid ISO date string' })
    startDate: Date;
    @ApiProperty({
        description: 'Fecha de fin de la campaña',
        example: '2025-12-15T00:00:00.000Z'
    })
    @IsDateString({},{ message: 'endDate must be a valid ISO date string' })
    endDate: Date;

    @ApiProperty({
        description: 'ID del fundacion',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID('4', { message: 'foundationId must be a valid UUID' })
    foundationId: string;
}
