import { prisma } from "../initializer/initprisma.js";
import crud from "../utils/crud.js";
import {checkvalues,sendresponse} from "../utils/utils.js";

let include = {order_item:true};

const get = async (req, res, next) => crud.get(req, res, next, prisma.order, include, { user_id: Number(req.user.id) });
const getbyid = async (req, res, next) => crud.getbyid(req, res, next, prisma.order, include);
const deletebyid = async (req, res, next) => crud.deletebyid(req, res, next, prisma.order, include);

const post = async (req, res, next) => {
    let { total, payment_id, pay_method, delivery_status, order_mode, items } = req.body;
    const required = { total, payment_id, pay_method, delivery_status, order_mode, items };
    checkvalues(required);
    delete req.body.items;
    items = items ? items : [];
    let order = await prisma.order.create({
        data: { ...req.body,user_id:Number(req.user.id), "created_on": new Date(), order_item: { createMany: { data: items } } },
        include
    });
    return sendresponse(res, order, 201,req);
}

const deliver = async (req, res, next) => {
    let { delivery_status } = req.body;
    const required = { delivery_status };
    crud.update(req, res, next, prisma.order, required,include)
}

const put = async (req, res, next) => {
    let { total, payment_id, pay_method, delivery_status, order_mode, items } = req.body;
    const required = { delivery_status };
    checkvalues(required);
    delete req.body.items;
    if (items) {
        for (const item of items) {
            if (item.id) {
                prisma.order_item.update({ where: { id: Number(item.id) }, data: item });
            }
        }
    }
    let order = await prisma.order.update({
        where: { id: Number(req.params.id) },
        data: { ...req.body,user_id:req.user.id, "created_on": new Date() },
        include
    });
    return sendresponse(res, order, 200,req);
}

export default { get, getbyid, post, put, deletebyid,deliver };