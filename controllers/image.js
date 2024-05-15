import { prisma } from "../initializer/initprisma.js";
import { sendresponse } from "../utils/utils.js";
import { uploadFile,uploadFiles, getFile,getFiles } from '../utils/s3.js';
//   if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
//     return res.status(400).send({message: 'Only jpg and png files are allowed'})
//   }
const get= async (req, res,next) => {
  try {
    const key = req.params.id;
    const readStream = getFile(key);
    readStream.pipe(res);
  } catch (e) {
    next(e)
  }
}

// const getfiles= async (req, res,next) => {
//   try {
//     const event = await prisma.Event.findUnique({ where: { id: Number(req.params.id) } });
//     res.json(await getFiles(event.images));
//   } catch (e) {
//     next(e)
//   }
// }

const uploadfiles =async (req, res, next) => {
  try {
    const urls = await uploadFiles(req.files);
    sendresponse(res, urls, 201, req);
  } catch (e) {
    next(e)
  }
}

const upload =async (req, res, next) => {
  try {
    const url = await uploadFile(req.file);
    sendresponse(res, url, 201, req);
  } catch (e) {
    next(e)
  }
}

const deletebyid = async (req, res, next) => {
  try {
    const key = req.params.id;
    await deleteFile(key);
    sendresponse(res, 'File deleted successfully', 200, req);
  } catch (e) {
    next(e)
  }
}

const deleteall = async (req, res, next) => {
  try {
    const keys = req.body.keys;
    await deleteFiles(keys);
    sendresponse(res, 'Files deleted successfully', 200, req);
  } catch (e) {
    next(e)
  }
}

export default { upload, uploadfiles, get, deletebyid, deleteall};