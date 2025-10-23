import { Module } from '@nestjs/common';
import { UserCampaignService } from './user-campaign.service';
import { UserCampaignController } from './user-campaign.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserCampaignController],
  providers: [UserCampaignService],
  imports: [CloudinaryModule,
      ConfigModule,
      UserModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        }),
      }),
    ],
})
export class UserCampaignModule {}
