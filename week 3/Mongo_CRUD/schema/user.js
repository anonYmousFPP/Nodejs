const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.MONGO_URL;

const mongoose = require("mongoose");
mongoose.connect(PORT);

const user = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
    }
})

const userSchema = mongoose.model('Users', user);
module.exports = userSchema;