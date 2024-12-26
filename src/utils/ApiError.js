class ApiError extends Error {
    constructor(
        statusCode,
        message="something went wrong",
        error=[],
        stack=""
    ){
        super(message) //override
        this.statusCode=statusCode//override
        this.data=NULL //
        this.message=message
        this.success=false;
        this.error=error


    }
}
export {ApiError}