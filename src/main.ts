// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // --- Swagger setup ---
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription(
      'API для дипломного мини-блога (NestJS + Prisma + PostgreSQL)',
    )
    .setVersion('1.0.0')
    .addBearerAuth() // для JWT Authorization: Bearer
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  // --- /Swagger setup ---

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
