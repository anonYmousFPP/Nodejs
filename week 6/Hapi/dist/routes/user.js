"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = exports.adminRoutes = void 0;
const bcrypt = __importStar(require("bcrypt"));
const Jwt = __importStar(require("jsonwebtoken"));
const user_schema_1 = __importDefault(require("../schema/user.schema"));
const checkSuperAdmin_1 = require("../middleware/checkSuperAdmin");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.SECRET_KEY || "";
exports.adminRoutes = [
    {
        method: "POST",
        path: "/admin/signup",
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            const saltRounds = 10;
            try {
                const { username, email, password, role } = request.payload;
                const existingSuper = yield user_schema_1.default.findOne({ role: "super" });
                if (existingSuper && role === "super") {
                    return h.response({ error: "Super admin already exists" }).code(409);
                }
                const salt = yield bcrypt.genSalt(saltRounds);
                const hashedPassword = yield bcrypt.hash(password, salt);
                const data = new user_schema_1.default({ username, email, password: hashedPassword, role });
                yield data.save();
                return h.response(data).code(201);
            }
            catch (error) {
                return h.response({ message: error.message }).code(400);
            }
        }),
    },
    {
        method: "POST",
        path: "/admin/login",
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { email, password } = request.payload;
                if (!email || !password) {
                    return h.response({ message: "Email and Password are required" }).code(400);
                }
                const user = yield user_schema_1.default.findOne({ email });
                if (!user) {
                    return h.response({ message: "Invalid credentials" }).code(401);
                }
                const isPasswordValid = yield bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return h.response({ message: "Invalid credentials" }).code(401);
                }
                if (user.role !== "super") {
                    return h.response({
                        message: "Access denied. Admin privileges required",
                    }).code(403);
                }
                console.log(jwtSecret);
                const token = Jwt.sign({ userId: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: "1h" });
                return h.response({
                    message: "Login successful",
                    token,
                    userId: user._id,
                }).code(200);
            }
            catch (error) {
                return h.response({ message: error.message }).code(400);
            }
        }),
    },
    {
        method: "POST",
        path: "/subAdmin",
        options: {
            pre: [{ method: checkSuperAdmin_1.checkSuperAdmin }],
        },
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = new user_schema_1.default(request.payload);
                yield data.save();
                return h.response(data).code(201);
            }
            catch (error) {
                return h.response({ error: error.message }).code(400);
            }
        }),
    },
    {
        method: "PATCH",
        path: "/subAdmin/{id}",
        options: {
            pre: [{ method: checkSuperAdmin_1.checkSuperAdmin }],
        },
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                if (!id) {
                    return h.response({ message: "Sub-admin id required" }).code(400);
                }
                const data = request.payload;
                if (!data) {
                    return h.response({ message: "Data is required" }).code(400);
                }
                const updateData = data;
                const updatedUser = yield user_schema_1.default.findByIdAndUpdate(id, updateData);
                if (!updatedUser) {
                    return h.response({ message: "Sub-admin not found" }).code(404);
                }
                return h.response({ message: "Data updated successfully" }).code(201);
            }
            catch (error) {
                return h.response({ error: error.message }).code(400);
            }
        }),
    },
    {
        method: "DELETE",
        path: "/subAdmin/{id}",
        options: {
            pre: [{ method: checkSuperAdmin_1.checkSuperAdmin }],
        },
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                if (!id) {
                    return h.response({ message: "Sub-admin id required" }).code(400);
                }
                const deletedUser = yield user_schema_1.default.findByIdAndDelete(id);
                if (!deletedUser) {
                    return h.response({ message: "Sub-admin not found" }).code(404);
                }
                return h.response({ message: "Data deleted successfully" }).code(201);
            }
            catch (error) {
                return h.response({ error: error.message }).code(400);
            }
        }),
    },
];
exports.userRoutes = [
    {
        method: "GET",
        path: "/",
        handler: (request, h) => {
            return "Hello World";
        },
    },
    {
        method: "GET",
        path: "/find/{id}",
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = yield user_schema_1.default.findById(request.params.id);
                if (!data) {
                    return h.response({ error: "User not found" }).code(404);
                }
                return h.response(data).code(200); // Changed to 200 for GET
            }
            catch (error) {
                return h.response({ error: error.message }).code(400);
            }
        }),
    },
];
