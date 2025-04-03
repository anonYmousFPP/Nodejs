const bcrypt = require("bcrypt");
const express = require("express");
const route = express.Router();

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

        const response = await db.create({name, age, email, password: hashedPassword, phoneNumber});
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

        const users = await db.find({})
            .select('-password -__v')
            .skip(skip)
            .limit(limit)
            .lean();

        const totalUsers = await db.countDocuments();

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