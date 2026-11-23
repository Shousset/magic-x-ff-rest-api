import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LoginRateLimitMiddleware } from './login-rate-limit.middleware';
import { jwtOptions } from './auth.config';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtOptions()),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginRateLimitMiddleware).forRoutes(AuthController);
  }
}
