import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include ={subcategory:{select:{id:true,name:true}}};

const get = async (req, res, next) => crud.get(req,res,next,prisma.category,include);
const getbyid = async (req, res, next) => crud.getbyid(req,res,next,prisma.category,include);
const deletebyid = async (req, res, next) => crud.deletebyid(req,res,next,prisma.category,include);
const put = async (req, res, next) => crud.update(req,res,next,prisma.category,required,include);

const post = async (req, res, next) => {
    let { name, image } = req.body;
    let required = { name, image };
    crud.create(req,res,next,prisma.category,required,include,{name});
}

export default{ get, getbyid, post, put, deletebyid };