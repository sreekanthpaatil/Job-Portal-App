import express from "express"
import isAuthorized from "../middleware/auth.js"
import {deleteJob, getAllJobs, getmyJobs, getSinglejob, postJob,updateJob} from "../controllers/jobController.js"
const router = express.Router();
router.get("/getall" , getAllJobs)  
router.post("/post", isAuthorized ,postJob)
router.get("/getalljob", isAuthorized ,getAllJobs)
router.put("/update/:id", isAuthorized ,updateJob) 
router.delete("/delete/:id", isAuthorized ,deleteJob)
router.get("/:id", isAuthorized , getSinglejob)
export default router;