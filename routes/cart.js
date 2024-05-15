import controller from "../controllers/cart.js"
import express from "express";
const router = express.Router();
router
  .get('/', controller.get)
  .post("/", controller.post)
  .put("/:id", controller.put)
  .delete("/:id", controller.deletebyid)
export default router;