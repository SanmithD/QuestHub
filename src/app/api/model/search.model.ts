import mongoose, { Document } from "mongoose";

export interface Search extends Document{
    questId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const searchSchema = new mongoose.Schema({
    questId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{ timestamps: true });

searchSchema.index({ questId: 1, userId: 1 },{ unique: true });

export const searchModel = mongoose.models.Search || mongoose.model("Search", searchSchema);