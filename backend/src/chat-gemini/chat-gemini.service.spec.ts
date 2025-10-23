import { Test, TestingModule } from '@nestjs/testing';
import { ChatGeminiService } from './chat-gemini.service';

describe('ChatGeminiService', () => {
  let service: ChatGeminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGeminiService],
    }).compile();

    service = module.get<ChatGeminiService>(ChatGeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
