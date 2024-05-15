import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

let include = { product: true };

const get = async (req, res, next) => crud.get(req, res, next, prisma.deal, include);
const deletebyid = async (req, res, next) => crud.deletebyid(req, res, next, prisma.deal, include);
const post = async (req, res, next) => {
    const { product_id } = req.body;
    const required = { product_id };
    await crud.create(req, res, next, prisma.deal, required, include,{product_id});
}

export default { get, post, deletebyid };