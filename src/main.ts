import 'dotenv/config';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // El frontend autentica las solicitudes con Bearer tokens, no con cookies.
  app.enableCors({
    origin: '*', // En producción, cambiar por el dominio exacto del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Cabeceras de seguridad por defecto (HSTS, X-Content-Type-Options, etc.).
  app.use(helmet());

  // Límite global de velocidad: evita abuso de fuerza bruta y flood de requests.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 300, // máximo 300 requests por IP por ventana
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Too many requests',
        message: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Filtra propiedades que no esten en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades adicionales
    }),
  );
  await app.listen(process.env.PORT ?? 3002);
}

void bootstrap().catch((error: unknown) => {
  console.error('Application failed to start:', error);
  process.exitCode = 1;
});
