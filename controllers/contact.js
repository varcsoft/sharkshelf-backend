import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include ={};

const get = async (req, res, next) => crud.get(req,res,next,prisma.contact,include);
const getbyid = async (req, res, next) => crud.getbyid(req,res,next,prisma.contact,include);
const deletebyid = async (req, res, next) => crud.deletebyid(req,res,next,prisma.contact,include);
const put = async (req, res, next) => crud.update(req,res,next,prisma.contact,required,include);

const post = async (req, res, next) => {
    let { name,phone,email,description } = req.body;
    const required = { name,phone,email,description };
    crud.create(req,res,next,prisma.contact,required,include);
}

export default{ get, getbyid, post, put, deletebyid };