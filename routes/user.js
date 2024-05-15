import usercontroller from "../controllers/user.js"
import express from "express";
const router = express.Router()

router
.get("/profile", usercontroller.getprofile)
.put("/profile", usercontroller.updateprofile)
.delete("/profile", usercontroller.deleteprofile)
export default router;