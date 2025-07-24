import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Compound index to ensure unique video per user in history
historySchema.index({ video: 1, user: 1 }, { unique: true });

export const History = mongoose.model("History", historySchema);