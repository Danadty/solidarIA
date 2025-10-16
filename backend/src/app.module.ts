import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoundationModule } from './foundation/foundation.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CampaignModule } from './campaign/campaign.module';
import { UserCampaignModule } from './user-campaign/user-campaign.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [FoundationModule, PrismaModule, UserModule, CampaignModule, UserCampaignModule, UserProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
