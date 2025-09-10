import mongoose from "mongoose";
import { model, Schema } from "mongoose";

const CommentSchema=new mongoose.Schema(
    {
        content:{
            type:String,
            // trim: true
            },
        video:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },{timestamps:true})

export const Comment = mongoose.model("Comment",CommentSchema);