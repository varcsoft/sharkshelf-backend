import controller from "../controllers/order.js"
import express from "express";
const router = express.Router();
router
  .get('/', controller.get)
  .get('/:id', controller.getbyid)
  .post("/", controller.post)
  .put("/deliver/:id", controller.deliver)
  .put("/:id", controller.put)
  .delete("/:id", controller.deletebyid)
export default router;