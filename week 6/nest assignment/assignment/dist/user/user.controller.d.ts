import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("../schema/user.schema").User> & import("../schema/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../schema/user.schema").User> & import("../schema/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateUser(id: string, updateUser: {}): Promise<import("../schema/user.schema").User>;
    deleteUser(id: string): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, import("../schema/user.schema").User> & import("../schema/user.schema").User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
