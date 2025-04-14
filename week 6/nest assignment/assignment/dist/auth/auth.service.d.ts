import { User } from '../schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from 'src/dto/login.dto';
import { signupDto } from 'src/dto/signup.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    login(body: loginDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
        };
    }>;
    signup(body: signupDto): Promise<{
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
