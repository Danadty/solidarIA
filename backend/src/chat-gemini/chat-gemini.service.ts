import { google } from '@ai-sdk/google';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateText } from 'ai';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatGeminiService {

    constructor(private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    public async recommend(userMessage: string) {
        if (!userMessage || userMessage.trim() === '') {
            throw new BadRequestException('Message is empty');
        }

        // Obtener fundaciones y campañas desde la base de datos
        const foundations = await this.prisma.foundation.findMany({
            select: {
                name: true,
                description: true,
                campaigns: {
                    select: {
                        title: true,
                        description: true,
                    },
                },
            },
        });

        // Preparar texto para el prompt
        const foundationsText = foundations
            .map(f => {
                const campaignsText = f.campaigns
                    .map(c => `    - ${c.title}: ${c.description}`)
                    .join('\n');
                return `- ${f.name}: ${f.description}\n  campaigns:\n${campaignsText}`;
            })
            .join('\n');

        console.log('Texto preparado para Gemini:\n', foundationsText);

        // Prompt para Gemini
        const prompt = `
Eres un asistente amigable que recomienda ONGs y sus campañas según el mensaje del usuario.
Usa la siguiente lista de ONGs y campañas para sugerir las más adecuadas.
Responde de forma breve, natural y empática, y decis que estas para recomendar.

Lista de ONGs y campañas:
${foundationsText}

Mensaje del usuario: "${userMessage}"
`;

        // Llamada a Gemini
        const result = await generateText({
            model: google('gemini-2.0-flash'),
            system:
                'Eres un asistente útil y amigable que recomienda ONGs y campañas a los usuarios de forma natural.',
            prompt,
        });

        console.log('Respuesta generada:', result.text);
        return { message: result.text };
    }

}
