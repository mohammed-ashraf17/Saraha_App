import joi from "joi"
import { GeneralRules } from "../../common/utils/generalRuels.js"

export const sendMessageSchema =
{
    body:joi.object(
        {
            content:joi.string().required(),
            userId:GeneralRules.userId.required(),
        }
    ).required(),

    files : joi.array().items(GeneralRules.file)
}

export const getMessageSchema =
{
    params: joi.object({
        messageId: joi.string().required()
    }).required()
}