import { Module } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { FoundationController } from './foundation.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
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
  controllers: [FoundationController],
  providers: [FoundationService],
})
export class FoundationModule {}
