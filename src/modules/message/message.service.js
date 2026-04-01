import successResponse from "../../common/utils/successes_response/succsses.response.js"
import * as db_service from "../../DB/db.service.js"
import messageModel from "../../DB/models/message.model.js"
import userModel from "../../DB/models/user.model.js"

export const sendMessage = async (req , res , next)=>
{
    
        const {content, userId} = req.body

        const user = await db_service.findOne({
            model: userModel,
            check: { _id: userId },  
        })

        if(!user) {
            throw new Error("User not found");
        }

        let attachmentsArr = []

        if(req.files?.length) {
            for (const file of req.files) {
                attachmentsArr.push(file.path)
            }
        }

        const message = await db_service.create({
            model: messageModel,
            dataa: {
                content,
                userId: user._id, 
                attachments: attachmentsArr
            }
        })

        successResponse({res, status:201, data: message})
    
}

export const getMessage = async (req , res , next)=>
{
    const {messageId} = req.params
    const message = await db_service.findOne(
        {
            model:messageModel,
            check:{_id: messageId}
        })

        if(!message)
        {
            throw new Error("message not found" , {cause:404});
            
        }

        successResponse({res , status:201 , data:message})

}

export const getMessages = async (req , res , next)=>
{
    const messages = await db_service.find(
        {
            model:messageModel,
        })
        successResponse({res , status:201 , data:messages})

}