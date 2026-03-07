import joi from "joi"
import { Types } from "mongoose"
export const GeneralRules = {
            userName:joi.string().min(5).max(40),
            phone:joi.string().pattern(new RegExp(/^[0-9]{11}$/)),
            age:joi.number().min(18).max(60),
            email:joi.string().email({tlds:{allow:['com' , 'net']}}),
            password:joi.string().pattern(new RegExp(/^[a-z]{5}[0-9]{7}$/)),
            cPassword:joi.string().valid(joi.ref("password")),
            userId: joi.string().custom((value , helper)=>{
                const isValid = Types.ObjectId.isValid(value)
                return isValid ? value : helper.message("inViled userId")
            }),
            
                file: joi.object({
                fieldname: joi.string().required(),
                originalname: joi.string().required(),
                encoding: joi.string().required(),
                mimetype: joi.string().required(),
                destination: joi.string().required(),
                filename: joi.string().required(),
                path: joi.string().required(),
                size: joi.number().required(),
                }).required().messages({"any.required":"file is required"}),

                
}