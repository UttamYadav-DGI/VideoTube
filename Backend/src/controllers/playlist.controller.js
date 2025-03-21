import mongoose, {isValidObjectId} from "mongoose"
import {Playlists} from "../models/playlists.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video}         from '../models/video.model.js'

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name){
        throw new ApiError(404,"name is not exists")
    }
    if(!description){
        throw new ApiError(404,"description not exists")
    }
    const userId=req.user?._id
    const {videoId}=req.params
    console.log("videoId",videoId);
    console.log("videoId", typeof videoId);
    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"invalid videoId")
    }
    if(!videoId){
        throw new ApiError(404,"video not exists")
    }
    if(!userId){
        throw new ApiError(404,"user not exists")
    }
    //TODO: create playlist
    const playlist=await Playlists.create(
        {
            name:name,
            description:description,
            video:videoId,
            owner:userId
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"playlist build successfully"))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!isValidObjectId(userId)){
        throw new ApiError(404,"invalid playlistId")
    }
   const playlists= await Playlists.find({owner:userId})
    if(!playlists || playlists.length===0){
        throw new ApiError(404,"playlist not exists")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,playlists,"user playlists fetch successfully"))
   
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist=await Playlists.findById(playlistId).populate("video")
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req,res)=>{
    const {playlistId, videoId} = req.params

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video ID")
    }

    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist ID")
    }

    const playlist = await Playlists.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"plalist not found")
    }

    if(req.user?._id.toString()!== playlist?.owner.toString()){
        throw new ApiError(401, "you do not have to add video in this playlist")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

    if(playlist.video.includes(videoId)){
        throw new ApiError(400,"video already exist in playlist")
    }
    console.log("playlist is ",playlist);

    const addToPlaylist = await Playlists.findByIdAndUpdate(
        playlistId,
        {
            $push:{
                video: videoId
            }
        },
        {
            new:true
        }
    )

    if(!addToPlaylist){
        throw new ApiError(500, "error while fetching video to playlist")
    }

    return res.status(200)
    .json(new ApiResponse(200, addToPlaylist, "video added successfully"))
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const userId=req.user?._id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404,"invalid videoId")
    }
    if(!videoId){
        throw new ApiError(404,"videoId not match")
    }
    const playlist= await Playlists.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not exists")
    }
    if(playlist.owner.toString()!==userId.toString()){
        throw new ApiError(404,"video remove only by owner of playlists")
    }

    const video= await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }

    const updatedPlaylist=await Playlists.findByIdAndUpdate(
        playlistId,
        {$pull:{video:new mongoose.Types.ObjectId(videoId)}},// remove a specific video in array
            {new :true},
    );

    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"video remove successfully"))
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404,"invalid playlistsId")
    }
    const playlist=await Playlists.findById(playlistId)
    
    if(!playlist){
        throw new ApiError(300,"something went wrong while delete playlist")
    }
    if(playlist?.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(300,"only owner is capable to delete a video")
    }
    const deletePlaylist=await Playlists.findByIdAndDelete(playlist)
    
    if(!deletePlaylist){
        throw new ApiError(500,"something went wrong while deleting playlists")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{},"playlist delete successfully"))
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404,"invalid objectId")
    }

    const playlist=await Playlists.findById(playlistId)
    if(playlist?.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(300,"only owner is capable to delete a video")
    }

    const playlistUpd= await Playlists.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name:name,
                description:description
            },
        },
        {
            new :true
        }
    )
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200,playlistUpd,"playlist update successfully"))
    //TODO: update playlist
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