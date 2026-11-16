import 'dotenv/config';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

/**
 * Orígenes CORS permitidos. Se leen de CORS_ORIGINS (lista separada por coma)
 * o, por compatibilidad, de FRONTEND_URL. Si no se configura nada, se usa la
 * lista por defecto para entornos locales.
 */
function resolveAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL;
  if (raw && raw.trim().length > 0) {
    return raw
      .split(',')
      .map((o) => o.trim())
      .filter((o) => o.length > 0);
  }
  return ['http://localhost:3000', 'http://localhost:3004'];
}

/**
 * Determina si se está en entorno de producción.
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const prod = isProduction();

  const allowedOrigins = resolveAllowedOrigins();

  // El frontend autentica las solicitudes con Bearer tokens, no con cookies.
  // Se rechazan orígenes no autorizados (403) en lugar de permitirlos con
  // `origin: '*'`, para evitar que cualquier sitio web llame a la API.
  type CorsOriginCallback = (err: Error | null, allow?: boolean) => void;

  app.enableCors({
    origin(origin: string | undefined, callback: CorsOriginCallback) {
      // Permitir solicitudes sin Origin (curl, server-side, mismo origen,
      // extensiones del navegador) y aquellas que estén en la lista blista.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS no permitido'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  // Cabeceras de seguridad con Helmet
  // En producción: HSTS, CSP estricta, etc.
  // En desarrollo: relajado para facilitar desarrollo.
  app.use(
    helmet({
      contentSecurityPolicy: prod
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:', 'http:'],
              connectSrc: ["'self'"],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
            },
          }
        : false, // Desactivado en dev para no bloquear HMR/inline styles
      hsts: prod
        ? {
            maxAge: 31536000, // 1 año
            includeSubDomains: true,
            preload: true,
          }
        : false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginEmbedderPolicy: false, // Necesario para recursos cross-origin
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      xContentTypeOptions: true,
      xDnsPrefetchControl: { allow: false },
      xDownloadOptions: true,
      xFrameOptions: { action: 'deny' },
      xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
      xPoweredBy: false,
    }),
  );

  // Límite global de velocidad: evita abuso de fuerza bruta y flood de requests.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: prod ? 200 : 300, // más estricto en producción
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Too many requests',
        message: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
      },
      // En desarrollo, no bloquear localhost para facilitar testing
      skip: prod
        ? undefined
        : (req) => req.ip === '::1' || req.ip === '127.0.0.1',
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Filtra propiedades que no esten en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades adicionales
      // Validación estricta: no permitir tipos incorrectos en DTOs
      validationError: { target: false, value: false },
    }),
  );

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  logger.log(
    `🚀 API escuchando en puerto ${port} (${prod ? 'PRODUCCIÓN' : 'DESARROLLO'})`,
  );
  logger.log(`🔒 CORS: ${allowedOrigins.join(', ')}`);
}

void bootstrap().catch((error: unknown) => {
  console.error('Application failed to start:', error);
  process.exitCode = 1;
});
