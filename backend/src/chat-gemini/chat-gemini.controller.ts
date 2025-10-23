import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatGeminiService } from './chat-gemini.service';
import { RecommendDto } from './dto/RecomendedDto';
import { Public } from 'src/common/decorators/public.decorator';
@ApiTags('Chat Gemini')
@Controller('chat-gemini')
export class ChatGeminiController {
    constructor(private chatGeminiService: ChatGeminiService) { }

    // @Public()
    // @Get('list-models')
    // async listModels() {
    //     return this.ChatGeminiService.listModels();
    // }
    @Public()
    @Post('recommend')
    @ApiOperation({ summary: 'Recommends a list of foundations based on a message' })
    public async recommend(@Body() body: RecommendDto) {
        if (!body.message || body.message.trim() === '') {
            throw new BadRequestException('Message is empty, please provide a message');
        }
        const result = await this.chatGeminiService.recommend(body.message);
        return result;
    }
}
