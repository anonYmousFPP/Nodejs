import express, { Request, Response, Express } from 'express';
import { createClient } from 'redis';

const app: Express = express();
app.use(express.json());

// Redis client setup
const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await redisClient.connect();
})();

// Interfaces
interface Submission {
    id: number;
    name: string;
    language: string;
}

interface ApiResponse<T> {
    message: string;
    data?: T;
    error?: string;
    count?: number;
}

// POST endpoint
app.post('/submissions', async (req: any, res : any) => {
    const { id, name, language } = req.body;

    if (typeof id !== 'number' || typeof name !== 'string' || typeof language !== 'string') {
        return res.status(400).json({ 
            message: "Invalid input types" 
        });
    }

    try {
        await redisClient.lPush("submissions", JSON.stringify({ id, name, language }));
        return res.status(201).json({ 
            message: "Data stored successfully",
            data: { id, name, language }
        });
    } catch (e: unknown) {
        const error = e as Error;
        return res.status(500).json({
            message: "Redis storage error",
            error: error.message
        });
    }
});

// GET endpoint
app.get('/submissions', async (req: any, res : any) => {
    try {
        const submissions = await redisClient.lRange("submissions", 0, -1);
        const parsedData = submissions.map(sub => JSON.parse(sub) as Submission);
        
        return res.status(200).json({
            message: "Data retrieved successfully",
            count: parsedData.length,
            data: parsedData
        });
    } catch (e: unknown) {
        const error = e as Error;
        return res.status(500).json({
            message: "Redis retrieval error",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});