import { google } from '@ai-sdk/google';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateText } from 'ai';
import { PrismaService } from 'src/prisma/prisma.service';
import { franc } from 'franc';
import { translate } from '@vitalets/google-translate-api';

@Injectable()
export class ChatGeminiService {

    constructor(private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    // public async listModels() {
    //     try {
    //         const models = await google().listModels();
    //         console.log('Available models:', models);
    //         return models;
    //     } catch (error) {
    //         console.error('Error listing models:', error);
    //         throw error;
    //     }
    // }
    /*
          public async recommend(userMessage: string) {
        if (!userMessage || userMessage.trim() === '') {
          throw new BadRequestException('Message is empty');
        }
    
        // Detectar idioma del usuario
        const langCode = franc(userMessage, { minLength: 3 });
        const userLang = langCode === 'eng' ? 'English' : 'Spanish';
        const targetLang = 'en'; // siempre queremos inglés para el output final
    
        // Obtener fundaciones y campañas
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
    
        // Traducir nombres, descripciones y campañas a inglés si es necesario
        const foundationsText = (
          await Promise.all(
            foundations.map(async (f) => {
              const name =
                userLang === 'Spanish'
                  ? (await translate(f.name || '', { to: 'en' })).text
                  : f.name;
              const desc =
                userLang === 'Spanish'
                  ? (await translate(f.description || '', { to: 'en' })).text
                  : f.description;
    
              const campaignsText = await Promise.all(
                f.campaigns.map(async (c) => {
                  const title =
                    userLang === 'Spanish'
                      ? (await translate(c.title || '', { to: 'en' })).text
                      : c.title;
                  const descC =
                    userLang === 'Spanish'
                      ? (await translate(c.description || '', { to: 'en' })).text
                      : c.description;
                  return `    - ${title}: ${descC}`;
                }),
              );
    
              return `- ${name}: ${desc}\n  campaigns:\n${campaignsText.join('\n')}`;
            }),
          )
        ).join('\n');
    
        console.log('Texto preparado para Gemini:\n', foundationsText);
    
        // Prompt para Gemini
        const prompt = `
    User language: ${userLang}
    Respond ONLY in English.
    
    Here are the ONGs and their campaigns:
    ${foundationsText}
    
    User: "${userMessage}"
    
    Provide a short, friendly recommendation of up to 5 NGOs that best match the user's interest.
    `;
    
        // Llamada a Gemini
        const result = await generateText({
          model: google('gemini-2.0-flash'),
          system: `You are a friendly AI that recommends NGOs. Always reply in English.`,
          prompt,
        });
    
        // Traducir el resultado a inglés si el usuario escribió en español
        const finalMessage =
          userLang === 'Spanish'
            ? (await translate(result.text, { to: 'en' })).text
            : result.text;
    
        console.log('Mensaje final en inglés:', finalMessage);
        return { message: finalMessage };
      }
    */
    public async recommend(userMessage: string) {
        if (!userMessage || userMessage.trim() === '') {
            throw new BadRequestException('Message is empty');
        }

        // Detectar idioma
        const langCode = franc(userMessage, { minLength: 3 });
        const userLang = langCode === 'eng' ? 'English' : 'Spanish';
        console.log('User language:', userLang);
        // Obtener fundaciones y campañas
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

        // Preparar texto de ONGs en el prompt
        const foundationsText = foundations
            .map(f => {
                const campaignsText = f.campaigns
                    .map(c => `    - ${c.title}: ${c.description}`)
                    .join('\n');
                return `- ${f.name}: ${f.description}\n  campaigns:\n${campaignsText}`;
            })
            .join('\n');

        console.log('Texto preparado para Gemini:\n', foundationsText);

        // Prompt: pedimos a Gemini que traduzca y genere la recomendación en inglés
        const prompt = `
The user's language is ${userLang}.
Translate all content below to English and provide a short, friendly recommendation of up to 5 NGOs that best match the user's interest.

NGOs and their campaigns:
${foundationsText}

User: "${userMessage}"
`;

        // Llamada a Gemini
        const result = await generateText({
            model: google('gemini-2.0-flash'),
            system: `You are a friendly AI assistant recommending NGOs. Always respond in English, regardless of user language.`,
            prompt,
        });

        console.log('Mensaje final en inglés:', result.text);
        return { message: result.text };
    }
}



// private async translateText(text: string, target: 'en' | 'es') {
//     if (!text) return '';
//     const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
//     const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

//     const res = await fetch(url, {
//         method: 'POST',
//         body: JSON.stringify({
//             q: text,
//             target,
//         }),
//         headers: { 'Content-Type': 'application/json' },
//     });

//     const data = await res.json();
//     return data?.data?.translations?.[0]?.translatedText || text;
// }

//}