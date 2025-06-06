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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../schema/user.schema");
const mongoose_2 = require("mongoose");
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getAllUsers() {
        try {
            return await this.userModel.find();
        }
        catch (error) {
            throw new Error("Error fetching users", error.message);
        }
    }
    async getUser(id) {
        try {
            return await this.userModel.findById(id);
        }
        catch (error) {
            throw new Error("Error fetching user", error.message);
        }
    }
    async updateUser(id, updateUser) {
        try {
            const response = await this.userModel.findByIdAndUpdate(id, updateUser, { new: true });
            if (!response) {
                throw new Error('User not found');
            }
            return response;
        }
        catch (error) {
            throw new Error("Error updating user", error.message);
        }
    }
    async deleteUser(id) {
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
            if (!deletedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return {
                message: `User deleted successfully with id ${id}`,
                user: deletedUser
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to delete user: ${error.message}`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map