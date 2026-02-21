import { Router } from "express";
import * as US from "./user.service.js"
import * as UV from "../user/user.validation.js"
import { authentication } from "../../common/middleware/auth.js";
import { authorization } from "../../common/middleware/authorization.js";
import { rolesEnum } from "../../common/enum/user.enum.js";
import validation from "../../common/middleware/validation.js";


const userRouter = Router()
userRouter.post("/signUp",validation(UV.signUpSchema) ,US.signUp)
userRouter.post("/signUp/gmail" , US.signUpWithGmail)
userRouter.post("/signIn", validation(UV.signInSchema), US.signIn)
userRouter.get("/" ,authentication, authorization({roles:[rolesEnum.user]}),US.getProfileUser)



export default userRouter