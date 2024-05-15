import jwt from "jsonwebtoken";
import constants from "../utils/constants.js"
import ApiError from "../utils/ApiError.js";
import { prisma } from "../initializer/initprisma.js";
import dotenv from "dotenv";
dotenv.config();

const getToken = (phone,id,role,time) => {
    return jwt.sign({ phone: phone, id: id.toString(), role: !role ? "role" : role }, constants.SECRET, { expiresIn: time ? time+"M" : process.env.JWT_REFRESH_EXPIRATION_DAYS+"d" })
};

const checkToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
            jwt.verify(token, constants.SECRET, (err, decoded) => {
                if (err) {
                    throw new ApiError(400,'Auth token is not valid');
                } else {
                    req.user = decoded;
                    checkuser(req.user,token,next);
                }
            });
        }
    }
    else {
        throw new ApiError(400,'Auth token is not supplied');
    }
};

async function checkuser(user,token,next) {
    try{
        if (!user) {
            throw new ApiError(400,'Auth token is not valid');
        }
        // user=await prisma.user.findUnique({ where: { id: Number(user.id) } });
        // if (!user || user.token != token ) {
            // await prisma.user.update({ where: { id: Number(user.id) }, data: { token: "" } });
            // throw new ApiError(400,'Auth token is not valid');
        // }
        if (user.status == "inactive") {
            throw new ApiError(400,'User is inactive');
        }
        next();
    } catch (e) {
        next(e);
    }
}

const isadmin = (req, res, next) => {
    if (req.user.role == "admin") {
        next();
    }
    else {
        res.status(500).json({ message: 'Only admin can access this page' });
    }
};

const ishost = (req, res, next) => {
    if (req.user.role == "host") {
        next();
    }
    else {
        res.status(500).json({ message: 'Only host can access this page' });
    }
};

const issuperadmin = (req, res, next) => {
    if (req.user.role == "superadmin") {
        next();
    }
    else {
        res.status(500).json({ message: 'Only superadmin can access this page' });
    }
};

export default { checkToken,isadmin,issuperadmin,ishost,getToken }