import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';

@Module({
    providers: [CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryService], // si lo usás desde otros módulos
  
})
export class CloudinaryModule {}
