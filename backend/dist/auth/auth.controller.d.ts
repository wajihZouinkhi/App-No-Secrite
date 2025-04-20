import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        token: string;
        user: {
            email: string;
            name: string;
        };
    }>;
    login(email: any, password: string): Promise<{
        token: string;
        user: {
            email: string;
            name: string;
        };
    }>;
}
