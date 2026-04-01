import { Router } from "express";
import * as US from "./user.service.js"
import * as UV from "../user/user.validation.js"
import { authentication } from "../../common/middleware/auth.js";
import { authorization } from "../../common/middleware/authorization.js";
import { rolesEnum } from "../../common/enum/user.enum.js";
import {multer_host} from "../../common/middleware/multer.js"
import multer_enum from "../../common/enum/multer.enum.js";
import validation from "../../common/middleware/validation.js";
import messageRouter from "../message/message.controller.js";

const userRouter = Router({caseSensitive:true , strict:true})

userRouter.use("/:userId/message" , messageRouter)

userRouter.post("/signUp/gmail" , US.signUpWithGmail)
userRouter.post("/signUp",multer_host({custom_typs:[...multer_enum.image,...multer_enum.pdf ,...multer_enum.video]})
        .single("avatar"),validation(UV.signUpSchema), US.signUp)

userRouter.patch("/Confirme-Email", validation(UV.ConfirmeEmailSchema),US.confirmeEmail) 
userRouter.post("/resend-Otp", validation(UV.resendOtpSchema),US.resendOtp) 

userRouter.post("/signIn",  validation(UV.signInSchema) , US.signIn)                                        
userRouter.get("/Profile" ,authentication, authorization({roles:[rolesEnum.user]}),US.getProfileUser)

userRouter.patch("/forget-password", validation(UV.forgetPasswordSchema),US.forgetPassword)                                        
userRouter.patch("/reset-password", validation(UV.resetPasswordSchema),US.resetPassword)  

userRouter.patch("/forget-password-Link", validation(UV.forgetPasswordLinkSchema),US.forgetPasswordLink)                                        
userRouter.patch("/reset-password-Link/:token", validation(UV.resetPasswordLinkSchema),US.resetPasswordLink)

userRouter.patch("/update-Profile",authentication ,validation(UV.updateProfileSchema) ,US.update_Profile)
userRouter.get("/share-Profile/:userId" ,validation(UV.shareProfileSchema),US.share_Profile)
userRouter.patch("/update-Password",validation(UV.updatePasswordSchema) ,authentication,US.update_Password)
userRouter.get("/refresh-token" ,US.refresh_token)
userRouter.post("/logout",  authentication , US.logout)         


export default userRouter