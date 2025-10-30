import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder
} from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LogginInterceptor } from './common/interceptors/logging.interceptor';
import { AuthGuard } from './common/guards/auth.guards';
// import express, { json } from 'express';
// import cors from 'cors';
// import 'dotenv/config'; // o import * as dotenv from 'dotenv'; dotenv.config();
// import { MercadoPagoConfig, Preference } from 'mercadopago';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    { origin: '*',  allowedHeaders: 'Content-Type, Authorization' , methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' }
  );
  app.use(new RequestIdMiddleware().use);
  app.useGlobalInterceptors(new LogginInterceptor(), new ResponseInterceptor());

  app.useGlobalPipes(new ValidationPipe());
  const jwtAuthGuard = app.get(AuthGuard);
  app.useGlobalGuards(jwtAuthGuard);


  const options = new DocumentBuilder()
    .setTitle('SolidarIA API')
    .setDescription('The Solidaria API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'enter your JWT token',
    },'bearer')
    // .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

// Obtener instancia de Express dentro de Nest
  // const expressApp = app.getHttpAdapter().getInstance();

  // Middlewares Express para Mercado Pago
  // expressApp.use(json());
  // expressApp.use(cors());

  // Configurar Mercado Pago
  // const client = new MercadoPagoConfig({
  //   accessToken: process.env.MP_ACCESS_TOKEN!,
  // });

  // Endpoint ping
  // expressApp.get('/ping', (req, res) => res.send('pong'));

  // Endpoint create-preference
  // expressApp.post('/create-preference', async (req, res) => {
  //   try {
  //     const item = req.body.items[0];
  //     const preference = await new Preference(client).create({
  //       body: {
  //         items: [
  //           {
  //             id: item.id,
  //             title: item.title,
  //             quantity: item.quantity,
  //             unit_price: parseFloat(item.unit_price),
  //           },
  //         ],
  //         back_urls: {
  //           success: 'https://www.tu-sitio/success',
  //           failure: 'https://www.tu-sitio/failure',
  //           pending: 'https://www.tu-sitio/pending',
  //         },
  //         auto_return: 'approved',
  //       },
  //     });
  //     res.status(200).json({ id: preference.id, init_point: preference.init_point });
  //   } catch (error) {
  //     console.error('Error creando preferencia:', error);
  //     res.status(500).json({ error: 'Error creating preference' });
  //   }
  // });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
