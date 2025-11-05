import { Module } from '@nestjs/common';
import { ChatGeminiService } from './chat-gemini.service';
import { ChatGeminiController } from './chat-gemini.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
    ConfigModule.forRoot({ isGlobal: true }), // hace que todas las variables de .env estén disponibles
  ],
  providers: [ChatGeminiService],
  controllers: [ChatGeminiController]
})
export class ChatGeminiModule {}
