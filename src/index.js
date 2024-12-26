//  require('dotenv'.config({path:'./env'}))
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config(
    {path:'./env'}
)


connectDB()
.then(app.listen(process.env.PORT) || 8000,()=>{
    console.log(`server is running at port :${process.env.PORT}`);
    app.on("error",()=>{
        console.log("error",(error)); //database to connect hoo rha but syd hamari express app baat nhi kr ppaa rhi 
        throw error
      })
})
.catch((err)=>{
    console.log("mongoDb connection failed ||||",err);
})










/*
import express from "express"
const app=express()
;(async()=>{//iife  inside () we erite call back
    try{
      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("error",()=>{
        console.log("error",(error)); //database to connect hoo rha but syd hamari express app baat nhi kr ppaa rhi 
        throw error
      })
      app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
      })

    }
    catch(error){
        console.log("Error",error)
        throw err;
    }
})();
*/