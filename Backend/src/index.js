import dotenv from 'dotenv'
import express from 'express'
import { app } from './app.js';
import connectDB from './db/index.js';
dotenv.config({
    path:'./env'
})   

connectDB()
.then(()=>{
    app.listen((process.env.PORT || 3000),()=>{
        console.log(`server is running at PORT: ${process.env.PORT}`);
    })
})
.catch(()=>{
    console.log("mongodb connection failed !!!!",error);
})
































































































































































//     const app=express();
// ;( async( )=>{
//     try{
//        await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       
//        app.on("error",(error)=>{
//         console.log("express not connnect with database",error);
//         throw error
//        })
//        app.listen(process.env.PORT,()=>{
//         console.log(`app is listen at port ${process.env.PORT}`);
//        })
//     }
//     catch(error){
//         console.log("error:",error)
//         throw error

//     }
// })();