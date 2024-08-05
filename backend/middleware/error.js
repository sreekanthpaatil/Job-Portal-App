class errorHandler extends Error{ 
    constructor(message,statusCode){
        super(message); 
        this.statusCode = statusCode;
    }
}
 
export const errorMiddleware = (err, req ,res ,next)=>{
 err.message = err.message || "Internal Server Error"  
 err.statusCode = err.statusCode || 500
if(err.name == "CaseError"){
    const message = `Duplicate at ${Object.keys(err.keyValue)} Entered`
    err = new errorHandler(message ,400)
}
if(err.code == 1100){
    const message = `Resource not found at ${err.path}`
    err = new errorHandler(message ,400)
}

if(err.name == "JsonWebTokenError"){
    const message = `Json web token is invalid`
    err = new errorHandler(message ,400)
}

if(err.name == "TokenExpiredError"){
    const message = `Token is Expired, Try Again`
    err = new errorHandler(message ,400)
}
return res.status(statusCode).json({
    sucess: false,
    message: err.message
})

}
export default errorHandler;