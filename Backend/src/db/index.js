import mongoose from 'mongoose';
import { DB_NAME } from '../constraints.js';

const connectDB=async()=>{
    try{
    const connectionInstance= await mongoose.connect(`mongodb+srv:///${DB_NAME}`)

    console.log(`\n mongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("mogodb not connected",error);
        process.exit(1);
    }

}
export default connectDB;
