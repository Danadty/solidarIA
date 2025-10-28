import { Module } from '@nestjs/common';
import { UserCampaignService } from './user-campaign.service';
import { UserCampaignController } from './user-campaign.controller';

@Module({
  controllers: [UserCampaignController],
  providers: [UserCampaignService],
})
export class UserCampaignModule {}
