import mongoose from 'mongoose';
import { DB_NAME } from '../constraints.js';

const connectDB=async()=>{
    try{
    const connectionInstance= await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)

    console.log(`\n mongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("mogodb not connected",error);
        process.exit(1); //0 → Success (Normal exit) 1 → Uncaught fatal exception (Error exit)
    
    }

}
export default connectDB;