import controller from "../controllers/wishlist.js"
import express from "express";
const router = express.Router();
router
  .get('/', controller.get)
  .post("/", controller.post)
  .delete("/:id", controller.deletebyid)
export default router;