import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class CreateUserCampaignDto {

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID('4', { message: 'userId must be a valid UUID v4' })
    userId: string

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID('4', { message: 'campaignId must be a valid UUID v4' })
    campaignId: string

}
