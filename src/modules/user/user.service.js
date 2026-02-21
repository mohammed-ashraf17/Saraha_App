
import { providerEnum } from "../../common/enum/user.enum.js";
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js";
import { bcryptPssword, comparePssword } from "../../common/utils/security/hash.security.js";
import successResponse from "../../common/utils/successes_response/succsses.response.js";
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import { v4 as uuidv4 } from "uuid";
import { generateToken, verifyToken } from "../../common/utils/token/token.service.js";
 import {OAuth2Client} from 'google-auth-library';


export const signUp = async (req , res , next)=>
{
    const {userId ,userName , email , password ,gender, age , cPassword, phone} = req.body
    if(password !== cPassword)
    {
        throw new Error("password is ValIde");
        
    }
    if(await db_service.findOne({model:userModel , check:{_id:userId , provider:providerEnum.system}}))
    {
        throw new Error("User NOT F0UND" , {cause:404});
    }

    const user = await db_service.create({model:userModel ,
         dataa:{
          userName 
        , email 
         , password :bcryptPssword({textPlan:password })
         , age 
         , phone:encrypt(phone)
        }})

    successResponse({res , message:"done create User" , data:user})

}

export const signUpWithGmail = async(req , res , next)=>
{
    const {idToken} = req.body
    // console.log(idToken);
const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
      idToken,
      audience: "652204469565-ognuu4jq5jeqi0aaa48qn67j26c3493v.apps.googleusercontent.com", 
  });
  const payload = ticket.getPayload();
  const {email , name , picture , email_verified} = payload
  let user = await db_service.findOne({model:userModel , check:{email}})
  if(!user)
  {
    user = await db_service.create({model:userModel,dataa:{
        email,
        userName:name,
        profilePicture:picture,
        confirmed:email_verified,
        provider:providerEnum.google
    }
        
    })
  }

  if(user.provider == providerEnum.system)
  {
    throw new Error("user signUP on system" , {cause:400});
    
  }
  const access_token = generateToken({paylod:{userId : user._id} , options:{
    expiresIn:"2h"
  }})
      successResponse({res , data:{access_token}})

  
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