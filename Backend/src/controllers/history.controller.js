import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { History } from "../models/history.model.js";

const addToHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const history = await History.create({
        video: videoId,
        user: userId
    });

    return res.status(201).json(
        new ApiResponse(201, history, "Added to watch history")
    );
});

const getUserHistory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const history = await History.find({ user: userId })
        .populate("video")
        .sort({ createdAt: -1 }); // Most recent first

    return res.status(200).json(
        new ApiResponse(200, history, "User history fetched successfully")
    );
});

const clearHistory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    await History.deleteMany({ user: userId });

    return res.status(200).json(
        new ApiResponse(200, {}, "History cleared successfully")
    );
});

const removeFromHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    await History.findOneAndDelete({
        video: videoId,
        user: userId
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Removed from history")
    );
});

export {
    addToHistory,
    getUserHistory,
    clearHistory,
    removeFromHistory
};