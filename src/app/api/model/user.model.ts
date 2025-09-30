import mongoose, { Document } from "mongoose";

export interface UserDoc extends Document{
    username: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<UserDoc>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
    },
},{ timestamps: true });

export const userModel = mongoose.models.User || mongoose.model('User', userSchema);