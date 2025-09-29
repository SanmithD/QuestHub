import mongoose, { Document, Schema } from "mongoose";

export interface Comment {
  userId: mongoose.Types.ObjectId;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Quest extends Document {
  questId?: string;
  userId: mongoose.Types.ObjectId;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes: mongoose.Types.ObjectId[];
  rankValue?: number;
  comments?: Comment[];
}

const commentSchema = new Schema<Comment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const questSchema = new Schema<Quest>(
  {
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    likes: { 
        type: [Schema.Types.ObjectId], 
        ref: "User", 
        default: [] 
    },
    rankValue: { 
        type: Number, 
        default: 0 
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export const questModel =
  mongoose.models.Quest || mongoose.model<Quest>("Quest", questSchema);
