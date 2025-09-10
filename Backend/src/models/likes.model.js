import mongoose, { model, Schema } from "mongoose";

const likeSchema =new Schema(
    {
        comment:{
            type:Schema.Types.ObjectId,
            ref:"comment"
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        likedBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        tweet:{
            type:Schema.Types.ObjectId,
            ref:"Tweet"
        },
       
    },{timestamps:true})

export const Like=new model("Like",likeSchema);