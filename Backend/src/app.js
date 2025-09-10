import cookieParser from "cookie-parser"; 
import express from "express";
import cors from 'cors'
const app = express();

// ✅ Must be ABOVE all routes and middleware
const corsOptions = {
<<<<<<< HEAD
  origin: [
    "http://localhost:5173", // for local development
    "https://video-tube-plum.vercel.app", // for production
  ],
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
=======
  origin: "https://video-tube-plum.vercel.app",  // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
>>>>>>> 98732060b852b903a2bc55eb28fb1b444a0404cb
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Body parsers and cookie parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Serve static files (if needed)
app.use(express.static("public"));

//routes import
import userRouter               from './routes/user.routes.js';
import videoRouter              from './routes/video.routes.js'
import commentRouter            from './routes/comment.routes.js'
import likeRouter               from './routes/like.routes.js'
import tweetRouter              from './routes/tweet.routes.js'
import dashboardRouter          from  './routes/dashboard.routes.js'
import subscriptionRouter       from './routes/subscription.routes.js'
import playlistRouter           from './routes/playlist.routes.js'
import historyRouter            from './routes/history.routes.js';

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use('/api/v1/comments',commentRouter)
app.use('/api/v1/likes',likeRouter)
app.use('/api/v1/tweets',tweetRouter)
app.use('/api/v1/dashboards',dashboardRouter)
app.use('/api/v1/subscriptions',subscriptionRouter)
app.use('/api/v1/playlists',playlistRouter)
app.use("/api/v1/history", historyRouter);

//https://localhost:8000/api/v1/users

export {app}
