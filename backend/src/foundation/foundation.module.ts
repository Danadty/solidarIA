import { Module } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { FoundationController } from './foundation.controller';

@Module({
  controllers: [FoundationController],
  providers: [FoundationService],
})
export class FoundationModule {}
