import * as bcrypt from "bcrypt";
import * as Jwt from "jsonwebtoken";
import User from "../schema/user.schema";
import Hapi, { ServerRoute } from "@hapi/hapi";
import { checkSuperAdmin } from "../middleware/checkSuperAdmin";

import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.SECRET_KEY || "";

interface UserSignupInterface {
    username: string;
    email: string;
    password: string;
    role: string;
}

interface UserLoginInterface {
    email: string;
    password: string;
}


export const adminRoutes: ServerRoute[]  = [
    {
        method: "POST",
        path: "/admin/signup",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            const saltRounds = 10;
            try {
                const { username, email, password, role } = request.payload as UserSignupInterface;
                const existingSuper = await User.findOne({ role: "super" });
                if (existingSuper && role === "super") {
                    return h.response({ error: "Super admin already exists" }).code(409);
                }

                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(password, salt);

                const data = new User({ username, email, password: hashedPassword, role });
                await data.save();
                return h.response(data).code(201);
            } catch (error) {
                return h.response({ message: (error as Error).message }).code(400);
            }
        },
    },
    {
        method: "POST",
        path: "/admin/login",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            try {
                const { email, password } = request.payload as UserLoginInterface;

                if (!email || !password) {
                    return h.response({ message: "Email and Password are required" }).code(400);
                }

                const user = await User.findOne({ email });
                if (!user) {
                    return h.response({ message: "Invalid credentials" }).code(401);
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return h.response({ message: "Invalid credentials" }).code(401);
                }

                if (user.role !== "super") {
                    return h.response({
                        message: "Access denied. Admin privileges required",
                    }).code(403);
                }

                console.log(jwtSecret);

                const token = Jwt.sign(
                    { userId: user._id.toString(), role: user.role },
                    jwtSecret,
                    { expiresIn: "1h" }
                );

                return h.response({
                    message: "Login successful",
                    token,
                    userId: user._id,
                }).code(200);
            } catch (error) {
                return h.response({ message: (error as Error).message }).code(400);
            }
        },
    },
    {
        method: "POST",
        path: "/subAdmin",
        options: {
            pre: [{ method: checkSuperAdmin }],
        },
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            try {
                const data = new User(request.payload);
                await data.save();
                return h.response(data).code(201);
            } catch (error) {
                return h.response({ error: (error as Error).message }).code(400);
            }
        },
    },
    {
        method: "PATCH",
        path: "/subAdmin/{id}",
        options: {
            pre: [{ method: checkSuperAdmin }],
        },
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            try {
                const { id } = request.params;
                if (!id) {
                    return h.response({ message: "Sub-admin id required" }).code(400);
                }

                const data = request.payload;
                if (!data) {
                    return h.response({ message: "Data is required" }).code(400);
                }

                const updateData = data as Record<string, any>;
                const updatedUser = await User.findByIdAndUpdate(id, updateData);
                if (!updatedUser) {
                    return h.response({ message: "Sub-admin not found" }).code(404);
                }

                return h.response({ message: "Data updated successfully" }).code(201);
            } catch (error) {
                return h.response({ error: (error as Error).message }).code(400);
            }
        },
    },
    {
        method: "DELETE",
        path: "/subAdmin/{id}",
        options: {
            pre: [{ method: checkSuperAdmin }],
        },
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            try {
                const { id } = request.params;
                if (!id) {
                    return h.response({ message: "Sub-admin id required" }).code(400);
                }

                const deletedUser = await User.findByIdAndDelete(id);
                if (!deletedUser) {
                    return h.response({ message: "Sub-admin not found" }).code(404);
                }

                return h.response({ message: "Data deleted successfully" }).code(201);
            } catch (error) {
                return h.response({ error: (error as Error).message }).code(400);
            }
        },
    },
];

export const userRoutes: ServerRoute[]  = [
    {
        method: "GET",
        path: "/",
        handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            return "Hello World";
        },
    },
    {
        method: "GET",
        path: "/find/{id}",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            try {
                const data = await User.findById(request.params.id);
                if (!data) {
                    return h.response({ error: "User not found" }).code(404);
                }
                return h.response(data).code(200); // Changed to 200 for GET
            } catch (error) {
                return h.response({ error: (error as Error).message }).code(400);
            }
        },
    },
];