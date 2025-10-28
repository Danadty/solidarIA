import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDonationDto } from './create-donation.dto';
import { IsEnum } from 'class-validator';
import { DonationStatus } from 'generated/prisma';
export class UpdateDonationDto {
    @ApiProperty({
        description: 'Nuevo estado de la donación',
        enum: DonationStatus,
        example: DonationStatus.COMPLETED,
    })
    @IsEnum(DonationStatus)
    status: DonationStatus;

}
