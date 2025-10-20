import { PartialType } from '@nestjs/swagger';
import { CreateCampaignImageDto } from './create-campaign-image.dto';

export class UpdateCampaignImageDto extends PartialType(CreateCampaignImageDto) {}
