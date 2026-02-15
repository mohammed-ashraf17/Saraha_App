
import { providerEnum } from "../../common/enum/user.enum.js";
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js";
import { bcryptPssword, comparePssword } from "../../common/utils/security/hash.security.js";
import successResponse from "../../common/utils/successes_response/succsses.response.js";
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import { v4 as uuidv4 } from "uuid";
import { generateToken, verifyToken } from "../../common/utils/token/token.service.js";


export const signUp = async (req , res , next)=>
{
    const {userId ,userName , email , password , age , phone} = req.body
    if(await db_service.findOne({model:userModel , check:{_id:userId}}))
    {
        throw new Error("User NOT F0UND" , {cause:404});
    }

    const user = await db_service.create({model:userModel ,
         dataa:{
          userName 
        , email 
         , password :bcryptPssword({textPlan:password , rounds:12})
         , age 
         , phone:encrypt(phone)
        }})

    successResponse({res , message:"done create User" , data:user})

}


export const signIn = async (req , res , next)=>
{
    const { email , password} = req.body
    const user = await db_service.findOne({model:userModel , check:{email , provider:providerEnum.system}})
    if(!user)
    {
        throw new Error("Emali Already Exist or provider is not system" , {cause:403});
    }

    if(! comparePssword({textPlan:password , cipertext: user.password}))
    {
        throw new Error("InValid Password" , {cause:409});
    }

    const access_token = generateToken({paylod:{userId : user._id} , options:
    {
            expiresIn :"1h",
            notBefore:1,
            noTimestamp:true,
            issuer:"http://localhost:3001",
            audience:"http://localhost:4000",
            jwtid:uuidv4()
    }})
    successResponse({res , data:{access_token}})
}


export const getProfileUser = async(req , res , next)=>
{
    successResponse({res , data:{...req.user._doc , phone:decrypt(req.user.phone)}})
}