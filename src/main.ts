import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // El frontend autentica las solicitudes con Bearer tokens, no con cookies.
  app.enableCors({
    origin: '*', // En producción, cambiar por el dominio exacto del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

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
