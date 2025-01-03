import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" ;
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        if (!user) throw new ApiError(404, "User not found");
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        
        user.refreshToken=refreshToken;
      await user.save({validateBeforeSave:false})

      return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating refresh and access token")
    }
}





const registerUser=asyncHandler(async(req,res)=>{
   
    const {fullname,email,username,password}=req.body
    // console.log("email:",email);
    if(
        [fullname,email,username,password].some((field)=>field?.trim()=="")
    ){
        throw new ApiError(400,"all fields are required")
    }
    const existedUser= await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    const avatarLocalPath= req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required");
    }

    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

  

    if(!avatar){
        throw new ApiError(400,"avatar file is required");
    }
    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken") //remove password and refreshtoken

    if(!createdUser){
        throw new ApiError(300,"something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered successfully")
    )
})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body

    if(!(username || email)){
        throw new ApiError(400,"username or email is required")
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"user not exists")
    }
    const isPasswordValid= await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

   const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)

   const loggedInUser= await User.findById(user._id).
   select("-password -refreshToken")

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
        "User logged In Successfully"
    )
)
})

const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{refreshToken:undefined}
    },
    {
        new :true
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


const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized access");
    }
   try {
     const decodedToken= await jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
     const user=await User.findById(decodedToken?._id)
     if(!user){
         throw new ApiError(401,"invalid refresh token")
     }
     if(incomingRefreshToken!==user.refreshToken){
         throw new ApiError(401,"Refresh token is expired")
     }
 
     //for generating new token
     const options={
         httpOnly:true,
         secure:true
     }
     const {accessToken,newrefreshToken}= await generateAccessTokenAndRefreshToken(user._id)
     
      return res
      .status(200)
      .cookie("refreshToken",newrefreshToken,options)
      .cookie("accesstoken",accessToken,options)
      .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken:newrefreshToken},
             "access token refreshed"
         )
      )
   } catch (error) {
        throw new ApiError(401,"error in generating new refresh token")
   }
})

   const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword,ConfirmPassword}=req.body;
    if(newPassword!==ConfirmPassword){
        throw new ApiError(401,"newPassword and ConfirmPassword are not match")
    }
    const user=await User.findById(req.user?._id);
    const isPasswordCorrect= await isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(401,"oldPassword is not match")
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false})
    
    return res
    .status(200)
    .json(
        new ApiResponse(
        (200),
        {},
        "Password change Successfully"
    )
   )
   })

   const getCurrentUser=asyncHandler(async(req,res)=>{
       return res
       .status(200)
       .json(200,req.user,"Current user fetched successfully")
   })

   const updateAccountDetail=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body
    if(!fullname || !email){
        throw new ApiError(400,"all field are required")
    }
    const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                this.fullname=fullname,
                this.email:email
            }
        },
        {new:true}
    ).select("-password")
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Account details update successfull")
    )
     
   })

   const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"error while uploading on avatar ")
    }
   const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"avatar image updated successfully")
    )
   })
   
   const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
   
    if(!coverImageLocalPath){
        throw new ApiError(401,"coverimage is missing")
    };
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(401,"error upload on cloudinary")
    }

    const user= findByIdAndUpdate(
        req.user?._id,
        {
            {
                $set:{coverImage=coverImage.url}
            }
        },
        {new :true}
    ).select("-password")

   return res.status(200).json(
    new ApiResponse(200,user,"coverimage updated successfully")
   )
})


export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateUserAvatar};