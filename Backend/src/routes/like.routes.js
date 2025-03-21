import express from 'express';
import Router from 'express';
import {upload} from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js'; 
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controller.js"

const router=express.Router()

router.use(verifyJWT)
router.route("/video").get(getLikedVideos)
router.route("/comment-like/c/:commentId").post(toggleCommentLike)
router.route("/tweet-like/t/:tweetId").post(toggleTweetLike)
router.route("/video-like/v/:videoId").post(toggleVideoLike)

export default router;


