import mongoose from "mongoose";
export declare class userSchema {
    name: String;
    email: String;
    password: String;
}
export declare const user: mongoose.Schema<userSchema, mongoose.Model<userSchema, any, any, any, mongoose.Document<unknown, any, userSchema> & userSchema & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, userSchema, mongoose.Document<unknown, {}, mongoose.FlatRecord<userSchema>> & mongoose.FlatRecord<userSchema> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
