import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  // this is use to prefix all routes with api/ ex: http://localhost/api/restaurants
  // app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
