import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from '../middlewares/auth.middlewares.js';
const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(verifyJWT,getUserChannelSubscribers)
    .post(toggleSubscription);  

router.route('/s/:subscriberId').get(getSubscribedChannels);

export default router