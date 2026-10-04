import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // El frontend autentica las solicitudes con Bearer tokens, no con cookies.
  app.enableCors({
    origin: '*', // En producción, cambiar por el dominio exacto del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const candidatePaths = [
    join(process.cwd(), 'public'),
    join(__dirname, '..', 'public'),
    join(__dirname, '..', '..', 'public'),
  ];
  const publicPath = candidatePaths.find((p) => fs.existsSync(p));
  if (publicPath) {
    app.useStaticAssets(publicPath);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Filtra propiedades que no esten en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades adicionales
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((error: unknown) => {
  console.error('Application failed to start:', error);
  process.exitCode = 1;
});
