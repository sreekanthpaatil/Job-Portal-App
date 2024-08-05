import { catchAsyncError } from "../middleware/catchAsyncError.js";
import errorHandler from "../middleware/error.js";
import { Job } from "../models/jobSchema.js";

//Fetch all the jobs!
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    sucess: true,
    jobs,
  });
});


export const postJob = catchAsyncError(async (req, res, next) => {
  const role = req.user.role;
  if (role == "Job Seeker") {
    return next(new errorHandler("Not authorized to post the job !", 400));
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;
  if(!title || !description || !category || ! country || !city || !location){
    return next (new errorHandler("Please provide full job details!",400))
  }

 

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(new errorHandler("Please either provide fixed salary or range salary !"));
  }
  


  if(salaryFrom && salaryTo && fixedSalary){
    return next(new errorHandler("Cannot enter fixed salary and ranged salary together !"))
  }


  const postedBy = req.user._id;


  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,

  })

res.status(200).json({
    sucess:true,
    message:"Job posted sucessfully !",
    job,
})

});


export const getmyJobs = catchAsyncError(async(req , res ,next)=>{
    const role = req.user.role;
    if (role == "Job Seeker") {
      return next(new errorHandler("Not authorized to get the resource !", 400));
    }
const myJobs =  await Job.find({
    postedBy: req.user._id 

})
res.status(200).json({
    sucess:true,
    myJobs, 
})
})


export const updateJob = catchAsyncError(async(req,res,next)=>{
    const role = req.user.role;
    if (role == "Job Seeker") {
      return next(new errorHandler("Not authorized to get the resource !", 400));
    }
    const {id} = req.params;
    let job = await Job.findById(id) 
    if(!job){
      return next(new errorHandler("Oops! Job not found !" ,404))
    }
  job  = await Job.findByIdAndUpdate(id , req.body,{ 
    new: true,
    runValidators: true,
    useFindAndModify: false
  }) 
  res.status(200).json({
    sucess: true,
    message: "Job Updated sucessfully !",
    job,
  })
})


export const deleteJob = catchAsyncError(async(req, res ,next)=>{
  const role = req.user.role;
    if (role == "Job Seeker") {
      return next(new errorHandler("Not authorized to get the resource !", 400));
    }
    const {id} = req.params;

let job = await Job.findById(id) 
    if(!job){
      return next(new errorHandler("Oops! Job not found !" ,404))
    }
    
    await job.deleteOne()
    res.status(200).json({
      sucess: true,
      message: "Job delete sucessfully !"
    })
})


export const getSinglejob = catchAsyncError(async(req, res , next)=>{
  const {id} = req.params
  try {
    const job  = await Job.findById(id)
    if(!job){
      return next (new errorHandler("Job not found !", 404))
    }
    res.status(200).json({  
      sucess: true,
      job
    })
  } catch (error) {
    return next ( new errorHandler("Invalid details !", 400))
  }
})