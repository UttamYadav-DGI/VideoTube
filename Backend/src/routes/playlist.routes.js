import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from '../middlewares/auth.middlewares.js';
const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-Playlist/:videoId").post(createPlaylist)//done

router.route("/fetch-playlist/:playlistId").get(getPlaylistById)//done
router.route('/update-playlist/:playlistId').patch(updatePlaylist)//done
router.route('/delete-playlist/:playlistId').delete(deletePlaylist)//done
    
    

router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);//done
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);//done

router.route("/user/:userId").get(getUserPlaylists);//done

export default router