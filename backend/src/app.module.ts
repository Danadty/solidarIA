import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoundationModule } from './foundation/foundation.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CampaignModule } from './campaign/campaign.module';
import { UserCampaignModule } from './user-campaign/user-campaign.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { DonationsModule } from './donations/donations.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CampaignImageModule } from './campaign-image/campaign-image.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [FoundationModule, PrismaModule, UserModule, CampaignModule, UserCampaignModule, UserProfileModule, DonationsModule, CloudinaryModule, CampaignImageModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
