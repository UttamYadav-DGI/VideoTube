import mongoose, { isValidObjectId } from "mongoose";
import {Tweet} from "../models/tweets.model.js";
// import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body;
    if(!content){
        throw new ApiError(404,"tweet content not found")
    }
    const owner=req.user?._id
    if(!owner){
        throw new ApiError(404,"user not found")
    }

    const createTweets=await Tweet.create(
        {
            owner:owner,
            content:content
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,createTweets,"tweets successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId=req.user?._id
    if(!isValidObjectId(userId)){
        throw new ApiError(404,"invalid user id")
    }
    const userTweets=await Tweet.find({owner:userId}).populate("owner")

    if(!userTweets || userTweets.length===0){
        return res
        .status(200)
        .json(new ApiResponse(200),[],"empty tweets")
    }

    const tweets=userTweets.map((tweets)=>({
        owner:tweets.owner,
        content:tweets.content,
        createdAt:tweets.createdAt

    }))
    return res
    .status(200)
    .json(new ApiResponse(200,tweets,"tweets fetched successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params // req.parames the data is come from url ex tweet/t/:4512id
    console.log(tweetId);
    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"invalid tweet id")
    }
    const userId=req.user?._id;
    if(!userId){
        throw new ApiError(404,"user not found")
    }
    const {content}=req.body;
    if(!content){
        throw new ApiError(404,"content not found")
    }
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet id is invalid")
    }
    //we update only own user tweet
    if(tweet.owner.toString()!==userId.toString()){
        throw new ApiError(401,"you update only your tweet")
    }
    const update= await Tweet.findByIdAndUpdate(
       tweetId,
       {
        $set:{
            content:content
        },
       },
        {
        $new:true
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200,update,"tweet update successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    const userId=req.user?._id;


    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"invalid tweetId")
    }
   
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"tweet not exists ")
    }
    if(tweet.owner.toString()!==userId.toString()){
        throw new ApiError(401,"you delete only own tweet")
    }
    
   const deleteTweet=await Tweet.findByIdAndDelete(tweetId)

   if(!deleteTweet){
    throw new ApiError(404,"something went wrong while deleting tweets");
   }

   return res
   .status(200)
   .json(new ApiResponse(200,deleteTweet,"tweet delete successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}