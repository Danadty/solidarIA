import { Module } from '@nestjs/common';
import { CampaignImageService } from './campaign-image.service';
import { CampaignImageController } from './campaign-image.controller';

@Module({
  controllers: [CampaignImageController],
  providers: [CampaignImageService],
})
export class CampaignImageModule {}
