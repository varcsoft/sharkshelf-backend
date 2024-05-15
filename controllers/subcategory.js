import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include ={category:{select:{name:true}}};

const get = async (req, res, next) => crud.get(req,res,next,prisma.subcategory,include);
const getbyid = async (req, res, next) => crud.getbyid(req,res,next,prisma.subcategory,include);
const deletebyid = async (req, res, next) => crud.deletebyid(req,res,next,prisma.subcategory,include);
const put = async (req, res, next) => crud.update(req,res,next,prisma.subcategory,{},include);

const post = async (req, res, next) => {
    let { name,category_id } = req.body;
    let required = { name,category_id };
    crud.create(req,res,next,prisma.subcategory,required,include,{name,category_id});
}

export default{ get, getbyid, post, put, deletebyid };