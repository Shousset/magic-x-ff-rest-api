import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        token_type: "Bearer";
        expires_in: number;
    }>;
    me(request: {
        user: unknown;
    }): unknown;
}
