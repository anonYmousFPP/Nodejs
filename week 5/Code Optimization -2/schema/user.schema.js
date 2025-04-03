const mongoose = require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL)
const user = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    age:{
        type: Number,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        require: true,
    },
    password: {
        require: true,
        type: String,
    },
    phoneNumber:{
        require: true,
        type: String,
    }
})

const userSchema = mongoose.model('userSchema', user);
module.exports = userSchema