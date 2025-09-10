import mongoose, {isValidObjectId, mongo} from "mongoose"
import {Like} from "../models/likes.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comments.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId =req.user?._id

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(401,"invalid video id")
    }
    const videoExists=await Video.findById(videoId);
    if(!videoExists){
        throw new ApiError(404,"video not exists")
    }
// If a matching document is found, existingLike will contain that document.
// If no matching document is found, existingLike will be null.
    const existedLike=await Like.findOne({
        video:videoId,
        likedBy: userId
    })
    if(existedLike){ //means the like already done
    await Like.findByIdAndDelete(existedLike._id)
    return res
    .status(200)
    .json(new ApiResponse(200,existedLike,"video unliked successfully"))
    }
    
    // if no like is exists
    const likeVideo= await Like.create(
        {
            video:videoId,
            likedBy:userId
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200,likeVideo,"video like successfully"))

   
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId=req.user?._id

    const commentIdexist= await Comment.findById(commentId)
    if(!commentIdexist){
        throw new ApiError(404,"commentId not exists")
    }

    const existingCommentLike= await Like.findOne(
        {
            comment:commentId,
            likedBy:userId
        }
    )
    if(existingCommentLike){
        await Like.findByIdAndDelete(existingCommentLike._id);
        return res
        .status(200)
        .json(new ApiResponse(200,existingCommentLike,"comment unlike successfully"))
    }

    const commentLike= await Like.create(
        {
            comment:commentId,
            likedBy:userId
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200, commentLike, "Comment like successfully"));

    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId=req.user?._id

    const tweetExists= await Tweet.findById(tweetId)
    if(!tweetExists){
        throw new ApiError(404,"tweet not exists")
    }

    const existingTweetLike=await Like.findOne(
        {
            tweet:tweetId,
            likedBy:userId
        }
    )
    if(existingTweetLike){
        await Like.findByIdAndDelete(existingTweetLike?._id)
    }

    const createTweetLike=await Like.create(
        {
            tweet:tweetId,
            likedBy:userId
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200,createTweetLike,"tweet like successfully"))
    //TODO: toggle like on tweet
    }
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId=req.user?._id;
    const likedVideos=await Like.find({likedBy:userId}).populate("video")

    if(!likedVideos || likedVideos.length===0){
        return res
        .status(200)
        .json(new ApiResponse(200,[],"user not like any video"))
    }
    // Extract the video details from the likes
    const videoDetail= likedVideos.map((like)=>like.video)
   return res
    .status(200)
    .json(new ApiResponse(200, videoDetail, "Liked videos fetched successfully"));


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
