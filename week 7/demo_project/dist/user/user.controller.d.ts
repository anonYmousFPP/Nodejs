import { userServices } from "./user.services";
export declare class userController {
    private readonly userServices;
    constructor(userServices: userServices);
    create(body: {
        name: string;
        password: string;
    }): string;
    getLogin(): string;
}
