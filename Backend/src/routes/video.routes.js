import { Router } from "express"
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    updateThumbnail,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"

const router=Router()
router.use(verifyJWT) //apply verifyJWT middleware to all route


router 
    .route("/")
    .get(getAllVideos)
    .post(upload.fields([
        {
            name:"videofile",
            maxcount:1
        },
        {
            name:"thumbnail",
            maxcount:1
        },
    ]),
    publishAVideo);

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("video"),updateVideo)


    router.route("/thumbnail/:videoId").patch(upload.single("thumbnail"),updateThumbnail)

    router.route("/toggle/publish/:videoId").patch(togglePublishStatus)

    export default router