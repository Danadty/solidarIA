import { Module } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { FoundationController } from './foundation.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[CloudinaryModule],
  controllers: [FoundationController],
  providers: [FoundationService],
})
export class FoundationModule {}
