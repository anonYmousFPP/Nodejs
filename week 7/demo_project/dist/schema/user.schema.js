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
exports.user = exports.userSchema = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
mongoose_2.default.connect("mongodb://localhost:27017/nest");
let userSchema = class userSchema {
    name;
    email;
    password;
};
exports.userSchema = userSchema;
__decorate([
    (0, mongoose_1.Prop)({ require: true }),
    __metadata("design:type", String)
], userSchema.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ require: true, unique: true }),
    __metadata("design:type", String)
], userSchema.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ require: true }),
    __metadata("design:type", String)
], userSchema.prototype, "password", void 0);
exports.userSchema = userSchema = __decorate([
    (0, mongoose_1.Schema)()
], userSchema);
exports.user = mongoose_1.SchemaFactory.createForClass(userSchema);
//# sourceMappingURL=user.schema.js.map