import { Injectable, Logger, NestMiddleware, Req, Res } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Límite de velocidad estricto para /auth/login.
 *
 * El rate-limit global de `main.ts` ya cubre el flood general, pero el login
 * es el punto más sensible a fuerza bruta: aquí limitamos a 5 intentos por IP
 * cada 15 minutos, independientemente del global (300 req / 15 min).
 *
 * Se aplica como middleware de módulo sobre el AuthModule para no tocar la
 * configuración global y poder testearlo de forma aislada.
 */
@Injectable()
export class LoginRateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoginRateLimitMiddleware.name);
  private readonly limiter: ReturnType<typeof rateLimit>;

  constructor() {
    this.limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // máximo 5 intentos de login por IP por ventana
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Too many requests',
        message:
          'Demasiados intentos de inicio de espera. Inténtalo de nuevo más tarde.',
      },
      // No contamos las respuestas 401/400 como "éxito": un ataque que
      // siempre recibe 401 no consume la cuota de un usuario legítimo.
      skipSuccessfulRequests: true,
    });
  }

  use(@Req() request: Request, @Res() response: Response, next: NextFunction) {
    // Solo protegemos el endpoint de login; el resto del módulo pasa derecho.
    if (request.method !== 'POST' || request.path !== '/auth/login') {
      return next();
    }

    this.limiter(request, response, (err) => {
      if (err) {
        this.logger.warn('Error en login-rate-limit', err);
      }
      return next();
    });
  }
}
