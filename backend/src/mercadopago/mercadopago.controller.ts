import { Controller, Get, Post, Body } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Get('ping')
  public async ping() {
    return await 'pong 🏓';
  }

  @Post('create-preference')
  public async createPreference(@Body() body: any) {
    const items = body.items || [];
    const preference = await this.mercadopagoService.createPreference(items);
    return preference;
  }
}
