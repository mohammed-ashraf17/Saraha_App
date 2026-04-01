import { Router } from "express";
import * as MS from "./message.service.js"
import * as MV from "./message.validation.js"
import { multer_local } from "../../common/middleware/multer.js";
import validation from "../../common/middleware/validation.js";
import multer_enum from "../../common/enum/multer.enum.js";
import { authentication } from "../../common/middleware/auth.js";

const messageRouter = Router() //{mergeParams:true}

messageRouter.post("/send",multer_local({custom_Path: "messages" ,custom_typs : multer_enum.image})
        .array("attachments", 3) ,validation(MV.sendMessageSchema),MS.sendMessage)
        
messageRouter.get("/get-message/:messageId" , authentication , validation(MV.getMessageSchema) , MS.getMessage)
messageRouter.get("/get-messages" , authentication ,  MS.getMessages)


export default messageRouter