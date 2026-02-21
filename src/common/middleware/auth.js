
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js";
import { verifyToken } from "../utils/token/token.service.js";

export const authentication = async (req , res , next)=>{

    const {auth} = req.headers
    if(!auth)
    {
        throw new Error("token not exist" , {cause:403});
    }

    const [perfix , token] = auth.split(" ")
    if(perfix !== "bearer")
    {
        throw new Error("inValid Token perfix");

    }
    const decoded= verifyToken({token})

    if(!decoded || !decoded?.userId)
    {
        throw new Error("inValid Token");
    }

      const user = await db_service.findOne({model:userModel , 
        check:{_id:decoded.userId} , select:"-password" })

     if(!user)
    {
        throw new Error("user NOT FOUND" , {cause:404});
    }

    req.user = user
    next()
}
 