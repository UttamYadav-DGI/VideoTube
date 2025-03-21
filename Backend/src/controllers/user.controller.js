import mongoose from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import {uploadonCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary"

const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId);
        console.log("user:",user); // for testing purpose
        const accessToken=user.generateAccessToken();// it's generate new access token
        // console.log("accessToken:",accessToken); for testing purpose
        const refreshToken=user.generateRefreshToken();// it's generate new refresh token

        user.refreshToken=refreshToken;// in that line the already exist refreshtoken in database we are update by currently define refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,error.message || "something went wrong while generating refresh and access token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    //get user details from frontend
    // validatin - not empty
    //check if user already exists ::username,email
    // ckeck for img check for avatar
    //upload them to cloudinary,avatar
    // create user-obj - create entry in db //obj isliye bnayege kuki mongodb m mostly data obj m store hota h
    // remove password and refresh token field from response
    //check for user creation successfully
    // retrun res

    const {fullname,email,username,password} =req.body

    //validation
    if(
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"all field are required")
    }

    // check user already exists or not
   const existedUser= await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"username already exists")
    }
    //check for images
  const avatarLocalPath= req.files?.avatar[0]?.path;
  const coverImageLocalPath= req.files?.coverImage?.[0]?.path ||  "";

  if(!avatarLocalPath){
    throw new ApiError(400,"avatar file is required")
  }


  //uplad on cloudinary
const avatar= await uploadonCloudinary(avatarLocalPath)
const coverImage= await uploadonCloudinary(coverImageLocalPath)


if(!avatar){
    throw new ApiError(400,"avatar file is required")
}
    const user=await User.create({ //create new user in database
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    }) // Fetching the newly created user, but without sensitive info (password, refresh token)
    // .select("-password -refreshToken") removes those fields from the returned object
    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,createdUser,"user register successfully",true)
    )

})

//--------------login---------------
    //reqbody->Data
    // //username,email
    // find the user 
    // password check
    // access and refreshtoken
    // send cookie
const loginUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body

    if(!(username || email)){
        throw new ApiError(400,"username or email is required");
    }
    const user =  await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(400,
            "user does not exists"
        )
    }
    const isPasswordValid  = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new ApiError(401,"password incoorect")
    }

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

   const loggedInUser=await User.findById(user._id).select("-password -refreshToken")


   //cookie security config
   const options={
    httpOnly:true,
    secure:true
   }
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user loggedIn successfully"

    )
   )

})
//////////////////////logout user
// cookies clear
// accessToken,refreshToken ko remove
const logoutUser=asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
       }
       return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new ApiResponse(200,{},"User logged Out"))
})
        //-- generateRefreshToken
        const refreshAccessToken = asyncHandler(async (req, res) => {
            const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        
            // Check if refresh token is provided
            if (!incomingRefreshToken) {
                throw new ApiError(401, "Unauthorized access: Refresh token is missing");
            }
        
            try {
                // Verify the refresh token
                const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
                // Find the user by ID from the decoded token
                const user = await User.findById(decodedToken._id);
        
                // Check if the user exists
                if (!user) {
                    throw new ApiError(401, "Invalid refresh token: User not found");
                }
        
                // Check if the incoming refresh token matches the user's refresh token
                if (incomingRefreshToken !== user.refreshToken) {
                    throw new ApiError(401, "Invalid or expired refresh token");
                }
        
                // Generate new access and refresh tokens
                const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
        
                // Set cookie options
                const options = {
                    httpOnly: true, // Correct property name
                    secure: true, // Ensure cookies are sent over HTTPS
                };
        
                // Send response with new tokens
                return res
                    .status(200)
                    .cookie("accessToken", accessToken, options)
                    .cookie("refreshToken", newRefreshToken, options)
                    .json(
                        new ApiResponse(
                            200,
                            { accessToken, refreshToken: newRefreshToken },
                            "Access token refreshed successfully"
                        )
                    );
            } catch (error) {
                // Handle JWT verification errors
                throw new ApiError(401, error?.message || "Invalid refresh token");
            }
        });
        
        

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {OldPassword,newPassword}= req.body

    const user=await User.findById(req.user?._id);
    const IsPasswordCorrect=await user.isPasswordCorrect(OldPassword);

    if(!IsPasswordCorrect){
        throw new ApiError(401,"Invalid old password");
    }
    user.password=newPassword;
   await user.save({validateBeforeSave:false})
 
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed succesfully"))
})

const getCurrentUser= asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json( new ApiResponse(200,req.user,"current user fetched successfully"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{

    const {username,email}=req.body
    // if we want to change files related data then we make a seperate file it's a mentor suggestions
    
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
               username: username,
                email:email //email:email
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"account updated successfully"))
})
 // remove img form that updated localServer
const updateUserAvatar=asyncHandler(async(req,res)=>{

    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(404,"avatar file is missing")
    }
    //remove existing avatarfile
    const userId=req.user?._id;
    const user= await User.findById(userId)
    if(!user){
        throw new ApiError(404,"user not found")
    }
    if(user.avatar){
        const publicId=user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId)
    }
    const avatar= await uploadonCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(401,"something went wrong while updateing avatar")
    }
   const userDocs= await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                avatar:avatar.url
            },
        },
            {new:true}
        
    ).select('-password')

    return res
            .status(200)
            .json(new ApiResponse(200,userDocs,"avatar update successfully"));

        //understand what happens in there .split('/).pop().split('.').[0] means the path is "https://res.cloudinary.com/.../avatar123.jpg"
        // split('/') [https, ,res.cloudinary.com,avatar123.png] 
        //.pop() it's remove all items and return last element [avatar123.png] left
        //split('.') it's split upper array into [avatar123,png]
        //[0] means first index ele avatar123 is last result
})

// update coverImage
const updateCoverImage= asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(404,"coverImage is missing")
    }
    const userId=req.user?._id;
    const user= await User.findById(userId);
    if(!user){
        throw new ApiError(404,"user not found")
    }
    if(user.coverImage){
        const publicId=user.coverImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId)
    }

    const uploadcoverImg= await uploadonCloudinary(coverImageLocalPath)
    if(!uploadcoverImg.url){
        throw new ApiError(401,"something went wrong while uplaoding coverimg")
    }
    const updatedUser=await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                coverImage:uploadcoverImg.url
            },
        },
        {new:true},
    ).select('-password')

    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"coverImg updated successfully"));
})
////////////////////////////////////////////////////////////////////////////
const getUserChannelDetails = asyncHandler(async (req, res, next) => {
    // const errors = validationResult(req);
  
    // if (!errors.isEmpty()) {
    //   return next(new ApiError(422, errors.array()));
    // }
  
    const { username } = req.params;
  
    if (!username) {
      return next(new ApiError(400, "username is missing"));
    }
  
    const pipeline = [
      {
        $match: {
            username,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          subscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: {
                $in: [req.user._id, "$subscribers.subscriber"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
            username: 1,
          fullName: 1,
          avatar: 1,
          coverImage: 1,
          subscribersCount: 1,
          subscribedToCount: 1,
          email: 1,
          isSubscribed: 1,
        },
      },
    ];
  
    const channelDetails = await User.aggregate(pipeline);
    // console.log("Channel details pipeline output \n", channelDetails);
  
    if (!channelDetails.length) {
      return next(
        new ApiError(400, `Channel with the name ${username} does not exist`)
      );
    }
  
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelDetails[0],
          "Channel details fetched successfully"
        )
      );
  });

//
const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos" ,//because db store video--> videos
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1,

                    
                                    }
                                }
                            ]

                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
        return res
        .status(200)
        .json(
            new ApiResponse(200,user[0].watchHistory,"watch history fetched successfully")
        )
})


export 
 {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserChannelDetails,
    getWatchHistory
}