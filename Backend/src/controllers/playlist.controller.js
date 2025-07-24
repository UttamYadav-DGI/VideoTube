import mongoose, { isValidObjectId } from "mongoose"
import { Playlists } from "../models/playlists.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from '../models/video.model.js'

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { videoId } = req.params
    const userId = req.user?._id

    if (!name?.trim()) {
        throw new ApiError(400, "Name is required")
    }
    if (!description?.trim()) {
        throw new ApiError(400, "Description is required")
    }
    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    if (!userId) {
        throw new ApiError(401, "Authentication required")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const playlist = await Playlists.create({
        name,
        description,
        video: videoId,
        owner: userId
    })

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const playlists = await Playlists.find({ owner: userId })
        .populate("video")
        .populate("owner", "username")

    if (!playlists?.length) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No playlists found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "Playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlists.findById(playlistId)
        .populate("video")
        .populate("owner", "username")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const playlist = await Playlists.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (req.user?._id.toString() !== playlist.owner.toString()) {
        throw new ApiError(403, "Unauthorized to modify this playlist")
    }

    if (playlist.video.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const updatedPlaylist = await Playlists.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { video: videoId }
        },
        { new: true }
    ).populate("video")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const playlist = await Playlists.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to modify this playlist")
    }

    const updatedPlaylist = await Playlists.findByIdAndUpdate(
        playlistId,
        {
            $pull: { video: videoId }
        },
        { new: true }
    ).populate("video")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlists.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this playlist")
    }

    await Playlists.findByIdAndDelete(playlistId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    if (!name?.trim() && !description?.trim()) {
        throw new ApiError(400, "At least one field is required for update")
    }

    const playlist = await Playlists.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this playlist")
    }

    const updatedPlaylist = await Playlists.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name?.trim() || playlist.name,
                description: description?.trim() || playlist.description
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}