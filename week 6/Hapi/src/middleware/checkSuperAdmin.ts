import * as Jwt from 'jsonwebtoken';
import { Request, ResponseToolkit } from '@hapi/hapi';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "";

export const checkSuperAdmin = async (request: Request, h: ResponseToolkit) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return h.response({ error: 'You have to login first' }).code(401);
    }

    try {
        const decoded = Jwt.verify(token, jwtSecret) as {
            userId: string;
            role: string;
        };

        if (decoded.role !== 'super') {
            return h.response({ error: 'Access Denied' }).code(403);
        }

        // Attach user data to request for use in route handlers
        (request as any).user = decoded;
        return h.continue;

    } catch (error) {
        return h.response({ error: 'Invalid token' }).code(401);
    }
};