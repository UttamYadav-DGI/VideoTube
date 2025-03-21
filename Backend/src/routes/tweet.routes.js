import Router from "express"
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router=Router()

router.use(verifyJWT)

router.route("/create").post(createTweet)//done
router.route("/userTweet").post(getUserTweets)//done
router.route("/updateTweet/:tweetId").patch(verifyJWT,updateTweet)//done
router.route("/delete/:tweetId").delete(deleteTweet)//done

export default router;