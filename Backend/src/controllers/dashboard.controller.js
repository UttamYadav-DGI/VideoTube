import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/likes.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId=req.user?._id;
    const {channelId,videoId}=req.params
    console.log(`channelId:${channelId} videoId:${videoId}`)
    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"invalid video id")
    }
    if(!userId){
        throw new ApiError(404,"invalid user id")
    }
    /*
   Fetch Total Videos Count:
    - Using `countDocuments()` to count all videos where the `owner` field matches `userId`.
    - This tells us how many videos the user has uploaded.
  */
    const totalvideos=await Video.countDocuments({owner:userId});
    console.log("totalVideos",totalvideos)
    console.log(totalvideos.length());
    if(!totalvideos ){
        throw new ApiError(400,"something went wrong while count total videos")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(404,"invalid channelId")
    }
   
    const subscribedUser=await Subscription.countDocuments({channel:channelId})//total subscriber

    const totallikes=await Like.countDocuments({video:videoId})

    
    const totalviews=await Video.aggregate([
        {
            $match: {owner:userId}
        },
        {
           $group:{
            _id:null,
            totalviews:{$sum:"$views"},
           },
        },
    ])

    if(!totalviews && totalviews.length()){
        throw new ApiError(404,"something went wrong while fetching total views")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalviews,
                totalvideos,
                totallikes,
                subscribedUser
            },
            "channel stats fetched successfully"
        ))

    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
     const userId=req.user?._id
     if(!isValidObjectId(userId)){
        throw new ApiError(404,"invalid objectId")
     }
     const channel=await Subscription.findById(userId)
     if(!channel){
        throw new ApiError(500,"channel not exists")
     }
    


     const getChannelVideos=await Video.aggregate([
        {
            $match:{
                owner:channel._id.channel
            },
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner details"
            },
        },
        {
            $unwind:'$owner details' //Uses $unwind to convert the array into an object for easy access.
        },
        {
            $project: {
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                thumbnail: 1,
                createdAt: 1,
                'ownerDetails.username': 1,
                'ownerDetails.avatar': 1,
            },
        },
     ])
     return res
     .status(200)
     .json(new ApiResponse(200,{getChannelVideos},"fetched all channel videos"))
})

export {
    getChannelStats, 
    getChannelVideos
    }