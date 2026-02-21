import joi from "joi"
import { genderEnum } from "../../common/enum/user.enum.js"


export const signUpSchema = {
    body:joi.object(
    {
        userName:joi.string().min(5).max(40).required(),
        email:joi.string().required().email({tlds:{allow:['com' , 'net']}}),
        password:joi.string().required().pattern(new RegExp(/^[a-z]{5}[0-9]{7}$/)),
        cPassword:joi.string().required().valid(joi.ref("password")),
        phone:joi.string().required().pattern(new RegExp(/^[0-9]{11}$/)),
        age:joi.number().min(18).max(60),
        gender:joi.string().valid(genderEnum.female , genderEnum.male)

    }).required(),

    query:joi.object(
    {
        x:joi.number().min(5)
    })
}


export const signInSchema = 
{
    body:joi.object(
    {
        email:joi.string().required().email({tlds:{allow:['com' , 'net']}}),
        password:joi.string().required().pattern(new RegExp(/^[a-z]{5}[0-9]{7}$/)),
        cPassword:joi.string().required().valid(joi.ref("password")),
    }).required(),

   query:joi.object(
    {
        x:joi.number().min(5)
    })
}
