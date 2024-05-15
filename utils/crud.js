import ApiError from "./ApiError.js";
import { checkvalues, sendresponse } from "./utils.js"
const get = async (req, res, next, object, include,where) => {
    try {
        where=where?where:{};
        const data = await object.findMany({include,where});
        return sendresponse(res, data, 200,req);
    } catch (e) {
        next(e);
    }
}

const getbyid = async (req, res, next, object, include) => {
    try {
        const data = await object.findUnique({ where: { id: Number(req.params.id) }, include });
        return sendresponse(res, data, 200,req);
    } catch (e) {
        next(e);
    }
}

const deletebyid = async (req, res, next, object, include) => {
    try {
        const data = await object.delete({ where: { id: Number(req.params.id) }, include });
        return sendresponse(res, data, 200,req);
    } catch (e) {
        next(e);
    }
}

const create = async (req, res, next, object, required, include,where) => {
    try {
        checkvalues(required);
        let data;
        if(where){
            data = await object.findFirst({ where: where });
            if(data) throw new ApiError(400, 'Object with same '+Object.keys(where).toString()+" already exists");
        }
        data = await object.create({ data: {...req.body,"created_on":new Date()}, include });
        return sendresponse(res, data, 201,req);
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next, object, required, include) => {
    try {
        checkvalues(required);
        const data = await object.update({ where: { id: Number(req.params.id) }, data: {...req.body}, include });
        return sendresponse(res, data, 200,req);
    } catch (e) {
        next(e);
    }
}

export default { get, getbyid, deletebyid, create, update };