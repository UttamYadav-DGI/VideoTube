import mongoose, {isValidObjectId, mongo} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadonCloudinary} from "../utils/cloudinary.js"
import cloudinary from "cloudinary";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query="", sortBy="createdAt", sortType="desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    if(!req.user){
        throw new ApiError(400,"User is not logged In")
    }
    //constructing match the object to filter videos
    const match={
        ...(query? ( {title:{$regex:query,$options:"i"}}) : {}), // if query exists,match titles that contain the search term(case-insensetive) "i" denoted case-insensitive
        ...(query? ({owner:mongoose.Types.ObjectId(req.user._id)}) : {}),// we use ternary operator (q ? a:b)
        }
    
    const videos= await Video.aggregate([
            {
                $match:match
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"videoByOwner"
                },
            },
            {
                $project:{
                    videofile:1,
                    thumbnail:1,
                    videoByOwner:{ $arrayElemAt: ["$videoByOwner", 0] },
                    title:1,
                    description:1,
                    duration:1,
                    views:1,
                    isPublished:1


                },
            },
            {
                $sort:{
                    [sortBy]:sortType==="desc" ? -1:1,
                },
            },
            {
                $skip:(page-1)*parseInt(limit),
            },
            {
                $limit:parseInt(limit),
            },
        ]);

        if(!videos?.length){
            throw new ApiError(401,"videos are not found")
        }
        
        return res
        .status(200)
        .json(new ApiResponse(200,videos,"videos fetched successfully"));

})


const publishAVideo = asyncHandler(async (req, res) => {
    
    //notes--get video
    //we require or fetched title,description,owner,thumbnail,video
    //we upload on cloudinary in try catch 
    // create db
    const {title,description,owner}=req.body
        if(!title){
            throw new ApiError(404,"title should not be empty")
        }
        if(!description){
            throw new ApiError(404,"description should not be empty")
        }

    const videoFileLocalPath=req.files?.videofile[0]?.path
    if(!videoFileLocalPath){
        throw new ApiError(404,"VideoPath is not found, it's required")
    }
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath){
        throw new ApiError(404,"thumbnail is required");
    }

    try {
    
        const videofile=await uploadonCloudinary(videoFileLocalPath)
        if(!videofile){
            throw new ApiError(404,"cloudinaryError:vido not upload")
        }
        const thumbnail=await uploadonCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(404,"thumbnail not upload on cloudinary")
        }
        
        //store video on database
        const videodb=await Video.create(
            {
                videofile:videofile.url,
                thumbnail:thumbnail.url,
                title,
                description,
                duration:videofile.duration
                // owner:req.user?._id
            });

            if(!videodb){
                throw new ApiError(500,"something went wrong while uploading videodb on database")
            }
            return res
            .status(200)
            .json(new ApiResponse(200,videodb,"video publish successfully"))
    }
    catch(error){
        throw new ApiError(500,error)
    }


    // TODO: get video, upload to cloudinary, create video
})
   

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId){
        throw new ApiError(400,"videoId not found");
    }
    const video = await Video.findById(videoId).populate("owner","name", "email");
    if(!video){
        throw new ApiError(404,"video not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,video,"videos fetched successfully"))
})
    //TODO: update video details like title, description, thumbnail
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // validate videoId (check if it's a valid mongoDb objectId)
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(401,"videoId invalid")
    }
       

    const videoLocalPath=req.file?.path;
    if(!videoLocalPath){
        throw new ApiError(401,"videLocalPAth is invalid")
    }
    
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(401,"video not exists")
    } 

     //now we update title description
     const {title,description}=req.body
     
     //remove if already video is exist
    if(video.videofile){
        const publicId=video.videofile.split('/').pop().split('.')[0];
        await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });
    }
    //insert new video
    const videoFile=await uploadonCloudinary(videoLocalPath);
    if(!videoFile.url){
        throw new ApiError(401,"video is not uploaded on cloudinary")
    }

    //preprare the updated object
    const updateFields={
        videofile:videoFile.url,
    };
        if(title)// if title is exists
        {
            updateFields.title=title// add title to updateFields
        }
        if(description){
            updateFields.description=description
        }
    const updatedVideo=await Video.findByIdAndUpdate(
            videoId,
          { $set:updateFields},// set is update only the specified fields
        {
            new:true
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200,updatedVideo,"video updated successfull"))

    })
    const updateThumbnail=asyncHandler(async(req,res)=>{
        const {videoId}=req.params
        const thumbnailLocalPath= req.file?.path;
            if(!thumbnailLocalPath){
                throw new ApiError(401,"thumbnail localPath not found");
            }
            const video=await Video.findById(videoId)
            if(!video){
                throw new ApiError(404,"video not found")
            }
            if(video.thumbnail){
                const publicId=video.thumbnail.split('/').pop().split('.')[0]
                await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });
            }
            const thumbnail=await uploadonCloudinary(thumbnailLocalPath)

            if(!thumbnail.url){
                throw new ApiError(401,"thumbnail not upload on cloudinary")
            }

          const updateVideo=  await Video.findByIdAndUpdate(
                videoId,
                {$set:{thumbnail:thumbnail.url}},
                {
                    new:true
                }

            );

            return res
            .status(200)
            .json(new ApiResponse(200),updateVideo,"thumbnail updated successfully")
    })

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"invalid video id")
    }
    const video=await Video.findByIdAndDelete(videoId);
    if(!video){
        throw new ApiError(404,"video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"video delete successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiResponse(404,"invalid videoId")
    }
    // find video document
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"video not found")
    }
    video.isPublished=!video.isPublished;
    await video.save();// update video status in database

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video toggle succesfully"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateThumbnail
}