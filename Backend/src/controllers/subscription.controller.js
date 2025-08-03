import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(500,"error while getting channel")
    }
    if(channelId.toString()===req.user?._id.toString()){
        throw new ApiError(400,"you not subscribe your own channel")
    }
    const isSubscribed= await Subscription.findOne({
        channel:channelId,
        subscriber:req.user?._id
    })
    if(isSubscribed){
        const unSubscribed=await Subscription.findByIdAndDelete(isSubscribed?._id)
        if(!unSubscribed){
            throw new ApiError(404,"error while unsubscribing channel")
        }
    }
    else{
        const subscribe=await Subscription.create({
            channel:channelId,
            subscriber:req.user?._id
        })
        if(!subscribe){
            throw new ApiError(500,"error while subscribing channel")
        }
    }
    // TODO: toggle subscription
    return res
    .status(200)
    .json(new ApiResponse(200,{},`subscriber status ${!isSubscribed}  `))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(404,"invalid channelId")
    }
    const channel=await User.findById(channelId)
    if(!channel){
        throw new ApiError(404,"channel not found")
    }
    const subscribers= await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscribers",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            avatar:1,
                            fullname:1,
                            username:1
                        }
                    }
                ]
            }
        },
        // {
        //     $addFields:{
        //         subscriber:{$first:"$subscribers"}
        //     }
        // },
        {
            $project:{
                subscribers:1
            }
        }
    ])
    if(!subscribers){
        throw new ApiError(404,"subscibers not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,subscribers,"subscriber count fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    // console.log("subscriber",subscriberId)
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(404,"invalid objectId")
    }
    const subscriber=await User.findById(subscriberId)
    if(!subscriber){
        throw new ApiError(404,"subscriber not found")
    }
    const channel= await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribedCount:{$size:"$subscribedTo"}
            }
        },
        {
            $project:{
                subscribedCount:1,
                subscribedTo:1
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200,channel,"subscriber count fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
