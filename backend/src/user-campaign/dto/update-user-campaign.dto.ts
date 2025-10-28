import { PartialType } from '@nestjs/swagger';
import { CreateUserCampaignDto } from './create-user-campaign.dto';

export class UpdateUserCampaignDto extends PartialType(CreateUserCampaignDto) {}
