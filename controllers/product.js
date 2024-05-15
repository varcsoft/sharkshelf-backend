import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js"

const include = {review: true,subcategory: true,category: true};

const get = async (req, res, next) => {
    if(req.query.category_id && req.query.subcategory_id) {
        return crud.get(req, res, next, prisma.product, { category_id: Number(req.query.category_id),subcategory_id: Number(req.query.subcategory_id)});
    } else if(req.query.category_id) {
        return crud.get(req, res, next, prisma.product, { category_id: Number(req.query.category_id)});
    } else if(req.query.subcategory_id) {
        return crud.get(req, res, next, prisma.product, { subcategory_id: Number(req.query.subcategory_id)});
    } else {
        return crud.get(req, res, next, prisma.product);
    }
    // crud.get(req, res, next, prisma.product,include, { category_id: Number(req.query.category_id),subcategory_id: Number(req.query.subcategory_id)});
}

const getbyid = async (req, res, next) => crud.getbyid(req, res, next, prisma.product,include);
const deletebyid = async (req, res, next) => crud.deletebyid(req, res, next, prisma.product,include);
const put = async (req, res, next) => crud.update(req, res, next, prisma.product,{},include);

const post = async (req, res, next) => {
    let { price, offer_price, status,name,description,category_id,subcategory_id,images } = req.body;
    const required = { price, offer_price, status,name,description,category_id,subcategory_id,images };
    crud.create(req, res, next, prisma.product, required,include,{name,subcategory_id});
}

export default { get, getbyid, post, put, deletebyid };