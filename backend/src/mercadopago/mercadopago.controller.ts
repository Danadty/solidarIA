import { Controller, Get, Post, Body } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadoPagoService) {}

  @Public()
  @Get('ping')
  public async ping() {
    return await 'pong 🏓';
  }
  @Public()
  @Post('create-preference')
  public async createPreference(@Body() body: any) {
    const items = body.items || [];
    const preference = await this.mercadopagoService.createPreference(items);
    return preference;
  }
}