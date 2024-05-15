import express from "express";
import controller from "../controllers/image.js"
const router = express.Router();
import multer from 'multer';
const upload = multer({ dest: '../utils/uploads' })
router
  .get('/', controller.get)
  // .get('/multiple', controller.getfiles)
  .post('/', upload.single('image'), controller.upload)
  .post('/multiple', upload.array('images'), controller.uploadfiles);

export default router;
