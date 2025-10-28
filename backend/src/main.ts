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


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
