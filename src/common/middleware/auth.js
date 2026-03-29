
import { ACCESS_SEUCRIT_KEY, PERFIX } from "../../../config/config.service.js";
import * as db_service from "../../DB/db.service.js"
import revokeTokenModel from "../../DB/models/revokeToken.model.js";
import userModel from "../../DB/models/user.model.js";
import { get, keys, revoke_key } from "../../DB/redis/redis.service.js";
import { verifyToken } from "../utils/token/token.service.js";

export const authentication = async (req , res , next) => {
    try {
        const { auth } = req.headers;
        if(!auth) throw new Error("token not exist", {cause:403});

        const [perfix, token] = auth.split(" ");
        if(perfix !== PERFIX) throw new Error("inValid Token perfix");

        const decoded = verifyToken({token, seucrit:ACCESS_SEUCRIT_KEY});
        if(!decoded || !decoded.userId) throw new Error("inValid Token");

        const user = await db_service.findOne({model:userModel, check:{_id:decoded.userId}});
        if(!user) throw new Error("user NOT FOUND", {cause:404});

        // تحقق من token revoked بعد ما يكون req.user موجود
        req.user = user;
        req.decoded = decoded;

        if(user?.changeCredential?.getTime() > decoded.iat * 1000) {
            throw new Error("Token Expired");
        }

        const revokeToken = await get({key:revoke_key({userId:req.user._id, jti:req.decoded.jti})});
        if(revokeToken) throw new Error("revokeToken Expired");

        next();

    } catch (error) {
        next(error);
    }
}
