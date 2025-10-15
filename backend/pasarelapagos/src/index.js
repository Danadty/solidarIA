"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: solidarIA\backend\pasarelapagos\src\index.ts
require("dotenv/config");
var mercadopago_1 = require("mercadopago");
var ACCESS_TOKEN_MERCADO_PAGO = "APP_USR-7951935500220073-101010-39d9923cf037746970e070be78e73407-2916706505";
var client = new mercadopago_1.MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MERCADO_PAGO,
    options: { timeout: 5000 },
});
var order = new mercadopago_1.Order(client);
var body = {
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
var requestOptions = {
    idempotencyKey: "clave-unica-123"
};
order.create({ body: body, requestOptions: requestOptions }).then(console.log).catch(console.error);
