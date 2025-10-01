import mongoose, { Document } from "mongoose";

export interface Bookmark extends Document {
  questId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookmarkSchema = new mongoose.Schema<Bookmark>(
  {
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.index({ questId: 1, userId: 1 }, { unique: true });

export const bookModel = mongoose.models.Book || mongoose.model("Book", bookmarkSchema);
