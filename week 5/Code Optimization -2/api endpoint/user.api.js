const bcrypt = require("bcrypt");
const express = require("express");
const route = express.Router();

const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
(async () => {
    await redisClient.connect();
})();


const db = require("../schema/user.schema");

const validateUser = require("../middleware/input_validation");

async function hashed(password){
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    catch(err){
        console.error("Hashing error:", err);
        throw err;
    }
}

route.post('/signup', validateUser, async (req, res) => {
    try{
        const {name, age, email, password, phoneNumber} = req.validatedData;

        const hashedPassword = await hashed(password);

        const response = await db.create({name, age, email, password: hashedPassword, phoneNumber}).explain();
        res.status(201).json({ message: 'User created', user: req.validatedData });
    }
    catch(err){
        return res.status(400).json({message: `Unable to save data ${err}`});
    }
})

route.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await db.findOne({ email});

    if(!user){
        res.send({message: `Email is not exist`}).status(404);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword){
        res.send({message: `Password not match`}).status(404);
    }

    res.send({message : `Login Successfull`}).status(200);
})


const getRedisKey = (page, limit) => `allUsers: ${page}:${limit}`;
route.get('/allUsers', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination. Page must be ≥1, limit 1-100'
            });
        }

        const redisKey = getRedisKey(page, limit);

        const cachedData = await redisClient.get(redisKey);
        const cachedTotal = await redisClient.get('totalUsers');

        if(cachedData && cachedTotal){
            console.log(`Serving from Redis`);
            return res.status(200).json({
                success: true,
                results: JSON.parse(cachedData),
                totalPages: Math.ceil(parseInt(cachedTotal) / limit),
                currentPage: page,
                totalItems: parseInt(cachedTotal)
            })
        }

        console.log("Fetching from MongoDB");
        const users = await db.find({})
            .select('-password -__v')
            .skip(skip)
            .limit(limit)
            .lean();

        const totalUsers = await db.countDocuments();

        // Cache in Redis (expire in 5 minutes)
        await redisClient.setEx(
            redisKey,
            30, // 5 minutes (300 seconds)
            JSON.stringify(users)
        );
        await redisClient.setEx('totalUsers', 300, totalUsers.toString());

        res.status(200).json({
            success: true,
            results: users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalItems: totalUsers
        });

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = route;