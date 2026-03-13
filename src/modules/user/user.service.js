
import { providerEnum } from "../../common/enum/user.enum.js";
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js";
import { bcryptPssword, comparePssword } from "../../common/utils/security/hash.security.js";
import successResponse from "../../common/utils/successes_response/succsses.response.js";
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import { randomUUID} from "crypto";
import { generateToken, verifyToken } from "../../common/utils/token/token.service.js";
import {OAuth2Client} from 'google-auth-library';
import cloudinary from "../../common/utils/cloudinary.js";
import fs from "node:fs"
import { ACCESS_SEUCRIT_KEY, PERFIX, REFRESH_SEUCRIT_KEY } from "../../../config/config.service.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";
import { deleteKey, get, get_keys, keys, revoke_key, set } from "../../DB/redis/redis.service.js";

export const signUp = async (req , res , next)=>
{
    
    
let uploadedImage = null

try {

const {userId ,userName , email , password ,gender, age , cPassword, phone } = req.body

if(password !== cPassword){
    throw new Error("password is ValIde")
}

if(await db_service.findOne({model:userModel , check:{_id:userId , provider:providerEnum.system}})){
    throw new Error("User NOT F0UND" , {cause:404})
}
if(!req.file){
    throw new Error("avatar file is required")
}

const {secure_url , public_id} =await cloudinary.uploader.upload(req.file.path,{
    folder:"saraha_app/users",
    resource_type:"auto"
})

uploadedImage = {public_id}   

const user = await db_service.create({
    model:userModel,
    dataa:{
        userName,
        email,
        password:bcryptPssword({textPlan:password}),
        age,
        phone:encrypt(phone),
        profilePicture:{secure_url , public_id}
    }
})

successResponse({res , message:"done create User" , data:user})

} catch (error) {
    console.log("cleanup running")
    
    if(req.file?.path && fs.existsSync(req.file.path)){
        fs.unlinkSync(req.file.path)
    }/* delete local file */

    
    if(uploadedImage?.public_id){
        await cloudinary.uploader.destroy(uploadedImage.public_id)
    }/* delete from cloudinary */

    console.log("cleanup running2")

    next(error)
}
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

    const jwtid = randomUUID()
    const access_token = generateToken({paylod:{userId : user._id} , 
        seucrit:ACCESS_SEUCRIT_KEY,
        options:{
            expiresIn : 60 * 3 ,
            issuer:"http://localhost:3001",
            audience:"http://localhost:4000",
            jwtid
    }})

    const refresh_token = generateToken({paylod:{userId:user._id},
        seucrit:REFRESH_SEUCRIT_KEY,
        options:{
            expiresIn:"1y",
            jwtid
        }})
    successResponse({res , data:{access_token , refresh_token}})
}


export const getProfileUser = async(req , res , next) => {
    try {
        const key = `profile :: ${req.user._id}`;
        const userExist = await get({key}); 

        if(userExist) {
            console.log("1");
            return successResponse({res , data:userExist});
        }

        console.log("2");
        const userData = { ...req.user._doc, phone: decrypt(req.user.phone) };
        await set({key, value: userData, ttl: 60*5});
        successResponse({res , data: userData});
    } catch (error) {
        next(error);
    }
}


export const refresh_token = async(req , res , next)=>
{
    const {authentication} = req.headers

    if(!authentication)
    {
        throw new Error("token not exist" , {cause:403});
    }

    const [ perfix , token] = authentication.split(" ")
    if(perfix !== PERFIX)
    {
        throw new Error("inValid Token perfix");
    }

    const decoded = verifyToken({token, seucrit:REFRESH_SEUCRIT_KEY})
    if(!decoded || !decoded?.userId)
    {
        throw new Error("inValid Token");
    }
    
    const user = await db_service.findOne({model:userModel , check:{_id:decoded.userId} , select:"-password"})
    if(!user)
    {
        throw new Error("user NOT FOUND" , {cause:404});
    }

    const access_token = generateToken({paylod:{userId : user._id} , 
        seucrit:ACCESS_SEUCRIT_KEY,
        options:{
            expiresIn :60 * 3,
            notBefore:1,
            noTimestamp:true,
            issuer:"http://localhost:3001",
            audience:"http://localhost:4000",
            jwtid:uuidv4()
    }})
    successResponse({res , data:{access_token}})
}


export const share_Profile = async(req , res , next)=>
{
    const {userId} = req.params

    const user = await db_service.findOne({model:userModel,
        check:{_id:userId},
        select:"-password"
    })

    if(!user)
    {
        throw new Error("user not found ", {cause:404});    
    }
    user.phone = decrypt(user.phone)
    successResponse({res , data:user})
}


export const update_Profile = async(req , res , next)=>
{
    let {userName , age , phone} = req.body

    if(phone)
    {
        phone = encrypt(phone)
    }
    const user = await db_service.findOneAndUpdate({
        model:userModel,
        check:{_id:req.user._id},
        update:{userName , age , phone}
    })

    if(!user)
    {
        throw new Error("user not found ", {cause:404});    
    }
    user.phone = decrypt(user.phone)
    await deleteKey({key:`profile :: ${req.user._id}`})
    successResponse({res , data:user})
}


export const update_Password = async(req , res , next)=>
{
    let {oldPassword , newPassword} = req.body
    if(!comparePssword({textPlan:oldPassword , cipertext :req.user.password}))
    {
        throw new Error("old password is valid");
    }
    
    const hash = bcryptPssword({textPlan:newPassword})
    req.user.password = hash
    await req.user.save()
    successResponse({res})
}

export const logout = async(req , res , next)=>
{
    const {flag} = req.query
    if(flag === "all")
    {
        req.user.changeCredential = new Date()
        await req.user.save()
        await deleteKey(await keys(get_keys({userId:req.user._id})))

        // await db_service.deleteMany({model:revokeTokenModel,
        //     check:
        //     {
        //         userId:req.user._id
        //     }
        // })
    }
    else
    {

        await set({
            key:revoke_key({userId:req.user._id , jti:req.decoded.jti}),
            value:`${req.decoded.jti}`,
            ttl:req.decoded.exp - Math.floor(Date.now()/1000)
        })
        // await db_service.create({model:revokeTokenModel ,
        //     dataa:{
        //         tokenId:req.decoded.jti,
        //         userId:req.user._id,
        //         expiredAt:new Date(req.decoded.exp *1000)
        //     }})
    }
    successResponse({res})
}