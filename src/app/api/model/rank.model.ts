import mongoose, { Document } from "mongoose";

export interface RankModel extends Document{
    _id: string;
    questId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rankValue?: number;
    createdAt?: Date;
    updatedAt? : Date;
}

const rankSchema = new mongoose.Schema<RankModel>({
    questId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest',
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rankValue: {
        type: Number,
    }
},{ timestamps: true });

rankSchema.index({ questId: 1, userId: 1 },{ unique: true });

export const rankModel = mongoose.models.Rank || mongoose.model('Rank', rankSchema);