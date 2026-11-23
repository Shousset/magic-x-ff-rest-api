import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { isUUID } from 'class-validator';
import { UsersService } from '../users/users.service';
import { jwtOptions } from './auth.config';

type JwtPayload = {
  sub: string;
  exp: number;
  iat: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly users: UsersService) {
    const { secret } = jwtOptions();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret as string,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    if (typeof payload.sub !== 'string' || !isUUID(payload.sub)) {
      throw new UnauthorizedException('Invalid token');
    }

    if (typeof payload.exp !== 'number') {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      // Consulta el usuario ACTUAL (no lo que decía el token al firmarse) y
      // aplica la proyección pública. Si ya no existe, su 404 se convierte
      // en 401: otros errores de persistencia no se ocultan como credenciales.
      return await this.users.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
