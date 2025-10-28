import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class MercadopagoService {
  private client: MercadoPagoConfig;

  constructor() {
    // Configura Mercado Pago con tu Access Token
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference(items: any[]) {
    try {
      const item = items[0];

      const preference = await new Preference(this.client).create({
        body: {
          items: [
            {
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              unit_price: parseFloat(item.unit_price),
            },
          ],
          back_urls: {
            success: 'https://www.tu-sitio/success',
            failure: 'https://www.tu-sitio/failure',
            pending: 'https://www.tu-sitio/pending',
          },
          auto_return: 'approved',
        },
      });

      return {
        id: preference.id,
        init_point: preference.init_point,
      };
    } catch (error) {
      console.error('❌ Error creando preferencia:', error);
      throw new Error('Error al crear la preferencia de pago.');
    }
  }
}
