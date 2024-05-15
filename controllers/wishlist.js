import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include = { product: true };

const get = async (req, res, next) => crud.get(req, res, next, prisma.wishlist, include, { user_id: Number(req.user.id) });
const deletebyid = async (req, res, next) => crud.deletebyid(req, res, next, prisma.wishlist, include);
const post = async (req, res, next) => {
    const { product_id } = req.body;
    const required = { product_id };
    req.body.user_id = Number(req.user.id);
    await crud.create(req, res, next, prisma.wishlist, required, include,{product_id,user_id: req.body.user_id});
}

export default { get, post, deletebyid };