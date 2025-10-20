import { Module } from '@nestjs/common';
import { CampaignImageService } from './campaign-image.service';
import { CampaignImageController } from './campaign-image.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [CampaignImageController],
  providers: [CampaignImageService],
})
export class CampaignImageModule {}
