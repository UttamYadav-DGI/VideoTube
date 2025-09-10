import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Step 1: Extract token from cookies or Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace(/^Bearer\s/, "");

  if (!token) {
    throw new ApiError(401, "Unauthorized: Token not found");
  }

  // Step 2: Verify and decode the token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }

  // Step 3: Validate decoded token and fetch user
  const userId = decodedToken?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: Invalid token payload");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  // Step 4: Attach user to request object and proceed
  req.user = user;
  next();
});
