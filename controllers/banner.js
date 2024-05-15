import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include ={product:true};

const get = async (req, res, next) => crud.get(req,res,next,prisma.banner,include);
const getbyid = async (req, res, next) => crud.getbyid(req,res,next,prisma.banner,include);
const deletebyid = async (req, res, next) => crud.deletebyid(req,res,next,prisma.banner,include);
const put = async (req, res, next) => crud.update(req,res,next,prisma.banner,required,include);

const post = async (req, res, next) => {
    let { title,quantity,status } = req.body;
    const required = { title,quantity,status };
    const user_id = Number(req.user.id);
    req.body.user_id = user_id;
    crud.create(req,res,next,prisma.banner,required,include,{title});
}

export default{ get, getbyid, post, put, deletebyid };