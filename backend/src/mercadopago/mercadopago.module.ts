import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';

@Module({
  controllers: [MercadopagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadopagoModule {}
