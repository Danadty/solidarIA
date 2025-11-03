import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { Public } from 'src/common/decorators/public.decorator';
import { DonationsService } from '../donations/donations.service';
import { ApiBody } from '@nestjs/swagger';
@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadoPagoService,
    private readonly donationsService: DonationsService,
  ) {}

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

  @Public()
  @Post('webhook')
  @ApiBody({
  description: 'Datos enviados por Mercado Pago',
  schema: {
    type: 'object',
    properties: {
      type: { type: 'string' },
      data: { 
        type: 'object',
        properties: { id: { type: 'string' } }
      }
    }
  }
})
  async webhook(@Req() req: Request, @Body() body: any) {
    try {
      console.log('Webhook recibido:', body);

      if (body.type === 'payment' || body.action === 'payment.created' || body.topic === 'payment') {
        const paymentId = body.data?.id || body['id'] || body['data.id'];
        if (!paymentId) {
          console.warn('paymentId no encontrado en webhook', body);
          return { message: 'No payment id' };
        }

        const paymentResp = await this.mercadopagoService.getPayment(paymentId);
        const paymentData = paymentResp?.response ?? paymentResp?.body ?? paymentResp;

        // Normalizar campos
        const {
          transaction_amount: amount = 0,
          status,
          id: transactionCode,
          metadata = {},
          payer = {},
        } = paymentData;

        try {
          await this.donationsService.create({
            amount,
            userId: metadata.user_id ?? metadata.userId ?? null,
            foundationId: metadata.foundation_id ?? metadata.foundationId,
            isAnonymous: false,
            donorName: payer.first_name
              ? `${payer.first_name} ${payer.last_name ?? ''}`.trim()
              : payer.name ?? null,
            donorEmail: payer.email ?? null,
            paymentMethod: paymentData.payment_method_id ?? paymentData.payment_type_id ?? null,
            transactionCode,
          });
        } catch (err) {
          console.error('Error guardando donación desde webhook:', err);
        }

        return { message: 'Webhook procesado correctamente' };
      }

      return { message: 'Evento ignorado' };
    } catch (err) {
      console.error('Error procesando webhook:', err);
      return { message: 'Error procesando webhook' };
    }
  }
}