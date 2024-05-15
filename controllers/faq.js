import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include ={};

const get = async (req, res, next) => crud.get(req,res,next,prisma.faq,include);
const getbyid = async (req, res, next) => crud.getbyid(req,res,next,prisma.faq,include);
const deletebyid = async (req, res, next) => crud.deletebyid(req,res,next,prisma.faq,include);
const put = async (req, res, next) => crud.update(req,res,next,prisma.faq,required,include);

const post = async (req, res, next) => {
    let { question,answer } = req.body;
    let required = { question,answer };
    crud.create(req,res,next,prisma.faq,required,include,{question});
}

export default{ get, getbyid, post, put, deletebyid };