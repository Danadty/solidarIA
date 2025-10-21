import { Module } from '@nestjs/common';
import { CampaignImageService } from './campaign-image.service';
import { CampaignImageController } from './campaign-image.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CloudinaryModule,AuthModule,JwtModule],
  controllers: [CampaignImageController],
  providers: [CampaignImageService],
})
export class CampaignImageModule {}
