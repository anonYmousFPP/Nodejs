import mongoose, {Schema, Document, Model, Types} from "mongoose";

import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGO_DB || "";

mongoose.connect(MONGO_URL);

interface userSchema extends Document {
    _id: Types.ObjectId,
    username: string,
    email : string,
    password: string,
    role: "super" | "sub"
};

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["super", "sub"],
        default: "sub",
    }
})

const User: Model<userSchema> = mongoose.model<userSchema>('User', userSchema);
export default User;