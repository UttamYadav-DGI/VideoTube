import { Router } from "express";
import {
    addToHistory,
    getUserHistory,
    clearHistory,
    removeFromHistory
} from "../controllers/history.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT); // Protect all history routes

router.route("/")
    .get(getUserHistory)
    .delete(clearHistory);

router.route("/:videoId")
    .post(addToHistory)
    .delete(removeFromHistory);

export default router;