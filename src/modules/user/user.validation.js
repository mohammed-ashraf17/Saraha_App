import joi from "joi"
import { genderEnum } from "../../common/enum/user.enum.js"
import { GeneralRules } from "../../common/utils/generalRuels.js"


export const signUpSchema = {
    body:joi.object(
    {
        userName:GeneralRules.userName.required(),
        email:GeneralRules.email.required(),
        password:GeneralRules.password.required(),
        cPassword:GeneralRules.cPassword.required(),
        phone:GeneralRules.phone.required(),
        age:GeneralRules.age,
        gender:joi.string().valid(genderEnum.female , genderEnum.male)

    }).required(),

    /*--------------single--------------*/
    
    file: GeneralRules.file.required(),

    /*--------------array--------------*/

    // files:joi.array().items(GeneralRules.file.required()).required(),

    /*--------------fields--------------*/

//     files:joi.object(
//         {
//             avatar:joi.array().items(GeneralRules.file.required()).required(),
//             avatars:joi.array().items(GeneralRules.file.required()).required(),
// }).required(),

}


export const signInSchema = 
{
    body:joi.object(
    {
        email:GeneralRules.email.required(),
        password:GeneralRules.password.required(),
        cPassword:GeneralRules.cPassword.required(),
    }).required(),
}

export const shareProfileSchema = 
{
    params:joi.object(
    {
        userId:GeneralRules.userId.required()
    }).required(),
}

export const updateProfileSchema = 
{
    body:joi.object(
    {
        userName:GeneralRules.userName,
        phone:GeneralRules.phone,
        age:GeneralRules.age,
        gender:joi.string().valid(genderEnum.female , genderEnum.male)
    }).required(),
}

export const updatePasswordSchema = 
{
    body:joi.object(
    {
        oldPassword:GeneralRules.password.required(),
        newPassword:GeneralRules.password.required(),
        cPassword:joi.string().valid(joi.ref("newPassword")),
    }).required(),
}

export const ConfirmeEmailSchema =
{
    body:joi.object(
        {
            email:GeneralRules.email.required(),
            code:joi.string().length(6).required()
        }
    ).required()
}

export const resendOtpSchema =
{
    body:joi.object(
        {
            email:GeneralRules.email.required(),
        }
    ).required()
}



