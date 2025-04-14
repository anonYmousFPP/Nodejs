"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileOwnershipMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
let ProfileOwnershipMiddleware = class ProfileOwnershipMiddleware {
    jwtService;
    userService;
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async use(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('Missing or invalid authorization header');
        }
        const token = authHeader.split(' ')[1];
        const userId = req.params.id;
        console.log(this.jwtService.verify(token));
        try {
            const decoded = this.jwtService.verify(token);
            console.log(decoded);
            const requestingUserId = decoded.sub;
            if (requestingUserId !== userId) {
                throw new common_1.UnauthorizedException('You can only view your own profile');
            }
            next();
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token or access denied');
        }
    }
};
exports.ProfileOwnershipMiddleware = ProfileOwnershipMiddleware;
exports.ProfileOwnershipMiddleware = ProfileOwnershipMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService])
], ProfileOwnershipMiddleware);
//# sourceMappingURL=profile-middleware.js.map