import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { dummyHash, verifyPassword } from './password';
import { LoginDto } from './dto/login.dto';

type LoginResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.users.findCredentialsByUsername(dto.username);
    const valid = await verifyPassword(
      dto.password,
      user ? user.passwordHash : dummyHash,
    );

    // Mismo 401 tanto si el username no existe como si la contraseña es
    // incorrecta: no informamos cuál de las dos falló.
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwt.signAsync({ sub: user.id });
    const payload = this.jwt.decode<{ exp: number; iat: number }>(
      access_token,
    );

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: payload.exp - payload.iat,
    };
  }
}
