import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService],
  imports: [CloudinaryModule],
})
export class UserProfileModule {}
