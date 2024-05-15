import usercontroller from "../controllers/user.js"
import express from "express";
const router = express.Router()

router
.post("/login", usercontroller.login)
.post("/fillusertable", usercontroller.fillusertable)
.post("/resetdbdata", usercontroller.resetdbdata)
.post("/gettestdbdata", usercontroller.gettestdbdata)
.post("/getproddbdata", usercontroller.getproddbdata)
.post("/filltestwithproddata", usercontroller.filltestwithproddata)
export default router;