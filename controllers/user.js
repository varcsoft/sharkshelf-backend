import { sendresponse } from "../utils/utils.js";
import axios from "axios";
import { prisma } from "../initializer/initprisma.js";
import auth from "../middlewares/checkAuth.js";
import ApiError from "../utils/ApiError.js";
import dotenv from "dotenv";
import { resetdb, updateusertable, filltestdatawithprod,gettestdata,getproddata } from "../utils/dbsetup.js";

dotenv.config();

const getuser = async (id) => await prisma.users.findUnique({ where: { user_id: id } });

const filluser = async (data) =>{
    const {email,name,address,profile_pic,created_on,role_id} = data;
    let user = await getuser(data.id);
    if (!user) user = await prisma.users.create({ data: { user_id: data.id, email,name,address,profile_pic,created_on,role_id} });
    else user = await prisma.users.update({ where: { user_id: data.id }, data: { email,name,address,profile_pic,created_on,role_id } });
    return user;
}

async function gettoken(data) {
    const token = auth.getToken(data.email, data.id, data.role_id);
    let user = await filluser(data);
    return {token,user};
}

const profile = async (req) => {
    console.log(req.user);
    const data = await axios.get(process.env.OCEANAUTH + "/user/profile/"+req.user.id, { headers: { Authorization: "Bearer "+process.env.APP_TOKEN } });
    if (data.data.message != "success") throw new ApiError(401, data.data.message);
    return data.data.data;
}

const getprofile = async (req, res, next) => {
    try {
        const data = await prisma.users.findUnique({ where: { user_id: Number(req.user.id) } });
        return sendresponse(res, { user: data }, 201,req);    
    } catch (e) {
        next(e);
    }
}

const updateprofile = async (req, res, next) => {
    try {
        const data = await axios.put(process.env.OCEANAUTH+"/user/profile/"+req.user.id,req.body,{ headers: { Authorization: "Bearer "+process.env.APP_TOKEN } });
        if(data.data.message!="success") throw new ApiError(401, data.data.message);
        const {email,name,id} = data.data.data;
        await prisma.users.update({ where: { user_id: id }, data: { email,name } });
        return sendresponse(res, { user: data.data.data }, 201,req);    
    } catch (e) {
        next(e);
    }
}

const deleteprofile = async (req, res, next) => {
    try {
        const data = await axios.delete(process.env.OCEANAUTH+"/user/deleteprofile/"+req.user.id,{ headers: { Authorization: "Bearer "+process.env.APP_TOKEN } });
        if(data.data.message!="success") throw new ApiError(401, data.data.message);
        const {id} = data.data.data;
        await prisma.users.update({ where: { user_id: id }, data: { status:"INACTIVE" } });
        return sendresponse(res, { user: data.data.data }, 201,req);    
    } catch (e) {
        next(e);
    }
}

const verifytoken = async (req) => {
    const data = await axios.get(process.env.OCEANAUTH+"/user/verifytoken",{ headers: { Authorization: req.headers.authorization } });
    if(data.data.message!="success") throw new ApiError(401, data.data.message);
    return data.data.data;
}

const login = async (req, res, next) => {
    try {
        let data = await verifytoken(req);
        data = await gettoken(data);
        return sendresponse(res, { vtoken: data.token, user: data.user }, 201,req);    
    } catch (e) {
        next(e);
    }
}

const fillusertable = async (req, res, next) => {
    try {
        // const data = await axios.get(process.env.OCEANAUTH+"/user",{ headers: { Authorization: "Bearer "+process.env.APP_TOKEN }});
        // if(data.data.message!="success") throw new ApiError(401, data.data.message);
        // const users = data.data.data;
        // for (let i = 0; i < users.length; i++) {
        //     await filluser(users[i]);
        // }    
        await updateusertable();
        return sendresponse(res,"Successfully filled user table", 201,req);    
    } catch (e) {
        next(e);
    }
}

const resetdbdata = async (req, res, next) => {
    try {
        await resetdb();
        return sendresponse(res,"Successfully reset database data", 201,req);
    } catch (e) {
        next(e);
    }
}

const filltestwithproddata = async (req, res, next) => {
    try{
        await filltestdatawithprod();
        return sendresponse(res,"Successfully filled test with prod data", 201,req);
    } catch (e) {
        next(e);
    }
}

const gettestdbdata = async (req, res, next) => {
    try {
        const data = await gettestdata();
        return sendresponse(res,data, 201,req);
    } catch (e) {
        next(e);
    }
}

const getproddbdata = async (req, res, next) => {
    try {
        const data = await getproddata();
        return sendresponse(res,data, 201,req);
    } catch (e) {
        next(e);
    }
}

export default { getproddbdata,gettestdbdata,login, getprofile,updateprofile,deleteprofile,fillusertable,resetdbdata,filltestwithproddata};