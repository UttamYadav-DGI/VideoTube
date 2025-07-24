
const asyncHandler=(requestHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
               .catch((err)=>next(err))
    }
}
export {asyncHandler};

//why we use this /////////********************************************************* */
// Avoid Repetitive Try-Catch Blocks:

// Without asyncHandler, you would need to wrap every asynchronous route handler in a try-catch block to handle errors.

// With asyncHandler, you can write cleaner and more concise code.

// Centralized Error Handling:

// Errors from asynchronous operations (e.g., database queries, API calls) are automatically caught and forwarded to Express's error-handling middleware.

// Consistency:

// Ensures consistent error handling across all route handlers.

// How It Works
// The asyncHandler function takes a requestHandler (an asynchronous route handler) as input and returns a new function. This new function:

// Wraps the requestHandler in a Promise.resolve() to ensure it always returns a promise.

// If the promise resolves successfully, the route handler proceeds as normal.

// If the promise is rejected (e.g., an error occurs), the .catch() block catches the error and passes it to Express's next function, which triggers the error-handling middleware.

// Example Without asyncHandler
// Without asyncHandler, you would need to write something like this:

// javascript
// Copy
// const someAsyncFunction = async (req, res, next) => {
//     try {
//         // Some asynchronous operation
//         const data = await fetchData();
//         res.json(data);
//     } catch (error) {
//         next(error); // Pass error to Express error handler
//     }
// };
// Example With asyncHandler
// With asyncHandler, you can simplify the above code:

// javascript
// Copy
// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//                .catch((err) => next(err));
//     };
// };

// // Usage
// const someAsyncFunction = asyncHandler(async (req, res, next) => {
//     const data = await fetchData(); // No need for try-catch
//     res.json(data);
// });
// Key Benefits of asyncHandler
// Cleaner Code:

// Removes the need for repetitive try-catch blocks in every route handler.

// Automatic Error Propagation:

// Errors are automatically passed to Express's error-handling middleware.

// Reusability:

// You can reuse asyncHandler across all your route handlers.

// When to Use asyncHandler
// When working with asynchronous route handlers in Express.js.

// When you want to avoid writing repetitive try-catch blocks.

// When you want to ensure consistent error handling across your application.
































































































// const asyncHandler=(fn)=>async(req,res,next)=>{ //(high order function)
//     try{
//         await fn(req,res,next);
//     }
//     catch(error){
//         res.status(error.code ||500).json({
//             success:false,
//             message:error.message
//         })
//     }

// }
// export {asyncHandler}