import mongoose,{model, Schema} from "mongoose";

const playlistsSchema=new Schema(
    {
       name:{
        type:String,
        required:true,
       },
       description:{
        type:String,
        required:false
       },
       video:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
    },{timestamps:true})

export const Playlists=new model("PlayLists",playlistsSchema);