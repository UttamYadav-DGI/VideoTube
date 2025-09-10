import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from '../middlewares/auth.middlewares.js';
const router = Router();
 // Apply verifyJWT middleware to all routes in this file

router.route("/c/:channelId").get(verifyJWT,getUserChannelSubscribers)
router.route("/c/:channelId").post(verifyJWT, toggleSubscription);

    
    

router.route('/s/:subscriberId').get(verifyJWT, getSubscribedChannels);
export default router
// `,