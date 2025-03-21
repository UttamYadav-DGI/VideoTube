import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comments.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"invalid video id")
    }
        const pageNo=parseInt(page)
        const limitNo=parseInt(limit)

        if(isNaN(pageNo) || isNaN(limitNo)){
            throw new ApiError(404,"pageno or limit is not a number")
        }
    
        const skip=(pageNo-1)*limitNo
        const comment=await Comment.findById(videoId)
        .skip(skip)
        .limit(limitNo)
        .sort({createAt:-1});

        //count total comment on video
        const totalComment=await Comment.countDocuments({video:videoId})

        const totalPage= Math.ceil(totalComment/limitNo)

        return res
        .status(200)
        .json(new ApiResponse(200,{comment,totalComment,totalPage},"comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content }=req.body
    const {videoId}=req.params
    const userId=req.user?._id
    if(!content){
        throw new ApiError(404,"content not exists")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"invalid videoId")
    }
   const comment= await Comment.create(
    {
        // owner:userId,
        // content:content,
        // video:videoId,
        owner:userId,
        content,
        video:videoId
    }
   )
   return res
   .status(200)
   .json(new ApiResponse(200,comment,"comment add successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params
    const {content}=req.body
    const userId=req.user?._id
    console.log(typeof userId)
    if(!content){
        throw new ApiError(404,"content is empty")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment is not found")
    }
    console.log("comment owner",typeof comment.owner.toString())
    if(comment.owner.toString()!==userId.toString()){
        throw new ApiError(404,"commment only updated by comment owner")
    }
    const updatedComment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{content:content},
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200,updatedComment,"comment update successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment id is invalid")
    }
    const updateComment=await Comment.findByIdAndDelete(commentId)
    return res
    .status(200)
    .json(new ApiResponse(200,updateComment,"delete comment successfullly"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }