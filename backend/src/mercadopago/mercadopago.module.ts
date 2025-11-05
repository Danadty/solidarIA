import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { DonationsModule } from 'src/donations/donations.module';

@Module({
  controllers: [MercadopagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
  imports: [DonationsModule],
})
export class MercadopagoModule {}
