import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include ={product:true};

const get = async (req, res, next) => crud.get(req,res,next,prisma.cart,include,{user_id:Number(req.user.id)});
const deletebyid = async (req, res, next) => crud.deletebyid(req,res,next,prisma.cart,include);
const put = async (req, res, next) => crud.update(req,res,next,prisma.cart,{},include);
const post = async (req, res, next) => {
    const { product_id, quantity } = req.body;
    const required = { product_id, quantity };
    req.body.user_id = Number(req.user.id);
    await crud.create(req, res, next, prisma.cart, required, include,{product_id,user_id: req.body.user_id});
    // let { cart } = req.body;
    // const user_id = Number(req.user.id);
    // const created_on = new Date();
    // for (let i = 0; i < cart.length; i++) {
    //     cart[i].user_id = user_id;
    //     cart[i].created_on = created_on;
    // }
    // req.body.user_id = user_id;
    // await prisma.cart.deleteMany({ where: { user_id } });
    // const data = await prisma.cart.createMany({ data: cart });
    // sendresponse(res, data, 201, req);
}

export default{ get, post, put, deletebyid };