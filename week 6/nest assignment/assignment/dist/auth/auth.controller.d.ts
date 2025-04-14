import { AuthService } from './auth.service';
import { loginDto } from 'src/dto/login.dto';
import { signupDto } from 'src/dto/signup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDTO: loginDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
        };
    }>;
    signup(signupDTO: signupDto): Promise<{
        name: string;
        email: string;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
}
