import { Test, TestingModule } from '@nestjs/testing';
import { ChatGeminiController } from './chat-gemini.controller';

describe('ChatGeminiController', () => {
  let controller: ChatGeminiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatGeminiController],
    }).compile();

    controller = module.get<ChatGeminiController>(ChatGeminiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
