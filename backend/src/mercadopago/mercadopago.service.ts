import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference(items: any[]): Promise<any> {
    try {
      const item = items[0];  // Asumiendo que manejas un ítem por preferencia
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
      return { id: preference.id, init_point: preference.init_point };
    } catch (error) {
      console.error('Error creando preferencia:', error);
      throw new Error('Error creating preference');
    }
  }

  async getPayment(paymentId: string): Promise<any> {
    try {
      const payment = await new Payment(this.client).get({ id: paymentId });
      return payment;
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      throw new Error('Error al obtener el pago');
    }
  }

}
