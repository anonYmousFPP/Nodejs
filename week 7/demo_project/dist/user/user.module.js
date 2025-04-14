"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModule = void 0;
const common_1 = require("@nestjs/common");
const user_services_1 = require("./user.services");
const user_controller_1 = require("./user.controller");
let userModule = class userModule {
};
exports.userModule = userModule;
exports.userModule = userModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.userController],
        providers: [user_services_1.userServices],
    })
], userModule);
//# sourceMappingURL=user.module.js.map