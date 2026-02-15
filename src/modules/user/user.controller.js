import { Router } from "express";
import * as US from "./user.service.js"
import { authentication } from "../../common/middleware/auth.js";
const userRouter = Router()

userRouter.post("/signUp" , US.signUp)
userRouter.post("/signIn" , US.signIn)
userRouter.get("/" ,authentication, US.getProfileUser)



export default userRouter