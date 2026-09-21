import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
type LoginResponse = {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
};
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    constructor(users: UsersService, jwt: JwtService);
    login(dto: LoginDto): Promise<LoginResponse>;
}
export {};
