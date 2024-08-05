import {catchAsyncError} from "../middleware/catchAsyncError.js"
import errorHandler from "../middleware/error.js"
import User from "../models/userSchema.js"
import {sendToken} from "../utils/jwtToken.js"


//register
export const register = catchAsyncError(async(req,res,next)=>{  
   const {name ,email ,phone, role, password} = req.body; 
   if(!name || !email || !phone || !role || !password){ 
return next(new errorHandler("Provide your complete detail !"))
   }
   const isEmail = await User.findOne({email})
   if(isEmail){
    return next(new errorHandler("Email already exists!"))
   }
   else{
    const user  = await User.create({
      name,
      email,
      phone,
      role,
      password,
    })
    sendToken(user, 200, res ,"User Registered Sucessfully")
   }
})

//login
export const login = catchAsyncError(async(req , res , next)=>{
  const { email , password , role} = req.body
  if(!email || !password || !role){
    return next(
      new errorHandler("Provide your details" ,400)
    )
  }
  const user  = await User.findOne({email}).select("+password");
  if(!user){
    return next (
    new errorHandler("Invalid password or email!" ,400)
    )
  }
  const isPasswordMatched = await user.comparePassword(password);
  if(!isPasswordMatched){
    return next (
    new errorHandler("Invalid password or email!" ,400)
    )
  }
  if(user.role !== role){
    return next(
    new errorHandler("User with this role not exists!" ,400)
    )
  }
  sendToken(user,200 ,res, "User login Sucessfully!")
  
}) 

//logout
export const logout = catchAsyncError(async(req , res , next)=>{
  res.status(201).cookie("token", "",{ 
    httpOnly: true,
    secure: true, 
    expireIn: new Date(Date.now()),
  }).json({
    sucess: true,
    message:"User Logout sucessfully !",
  })
})


//Get the user!
export const getUser = catchAsyncError(async(req,res,next)=>{
  const user = req.user;
  res.status(200).json({
    sucess: true,
    user,
  })
})