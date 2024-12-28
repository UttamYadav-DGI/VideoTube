const asyncHandler=(requestHandler)=>{
   return  (req,res,next)=>{
           Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))

    }
}
export {asyncHandler}








//const asyncHandler=()=>{} //simple call back
//const asyncHandler=()=>{()=>{}} //callback k andr call back
// const asyncHandler=()=>()=>{} //hum khuch return nhi kr rhe h isliye currly braces hta diya

// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({ //errcode y phir json response
//             success:false,
//             message:error.message
//         })

//     }
// }