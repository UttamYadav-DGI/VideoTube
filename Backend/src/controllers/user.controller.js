import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message || "Token generation failed");
  }
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  // domain option is not needed if frontend and backend are on different top-level domains
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if ([fullname, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) throw new ApiError(409, "Username or email already exists");

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || "";

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadonCloudinary(avatarLocalPath);
  const coverImage = await uploadonCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "User registration failed");

  return res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email)) throw new ApiError(400, "Username or email required");

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(400, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, { refreshToken: undefined }, { new: true });

  return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Refresh token is missing");

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    return res.status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error.message || "Token invalid");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { OldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(OldPassword);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User profile fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { username, email } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Account updated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(404, "Avatar file missing");

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.avatar) {
    const publicId = user.avatar.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }

  const avatar = await uploadonCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(401, "Avatar upload failed");

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, updatedUser, "Avatar updated"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) throw new ApiError(404, "Cover image missing");

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.coverImage) {
    const publicId = user.coverImage.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }

  const coverImage = await uploadonCloudinary(coverImageLocalPath);
  if (!coverImage.url) throw new ApiError(401, "Cover upload failed");

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, updatedUser, "Cover image updated"));
});

const getUserChannelDetails = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  if (!username) return next(new ApiError(400, "Username missing"));

  const pipeline = [
    { $match: { username } },
    { $lookup: { from: "subscriptions", localField: "_id", foreignField: "channel", as: "subscribers" } },
    { $lookup: { from: "subscriptions", localField: "_id", foreignField: "subscriber", as: "subscribedTo" } },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: { $in: [req.user._id, "$subscribers.subscriber"] },
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
  if (!channelDetails.length) return next(new ApiError(400, `No user: ${username}`));

  return res.status(200).json(new ApiResponse(200, channelDetails[0], "Channel details fetched"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }],
            },
          },
          { $addFields: { owner: { $first: "$owner" } } },
        ],
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, user[0]?.watchHistory || [], "Watch history fetched"));
});

export {
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
  getWatchHistory,
};
