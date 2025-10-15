// filepath: solidarIA\backend\pasarelapagos\src\index.ts
import 'dotenv/config';
import { MercadoPagoConfig, Order } from "mercadopago";

const ACCESS_TOKEN_MERCADO_PAGO="APP_USR-7951935500220073-101010-39d9923cf037746970e070be78e73407-2916706505"

const client = new MercadoPagoConfig({
  accessToken: ACCESS_TOKEN_MERCADO_PAGO as string,
  options: { timeout: 5000 },
});

const order = new Order(client);

const body = {
  external_reference: "pedido-123",
  total_amount: 1000.00,
  items: [
    {
      title: "Producto de ejemplo",
      quantity: 1,
      unit_price: 1000.00,
    },
  ],
  payer: {
    email: "usuario@email.com",
  },
};

const requestOptions = {
  idempotencyKey: "clave-unica-123"
};



order.create({ body, requestOptions }).then(console.log).catch(console.error);