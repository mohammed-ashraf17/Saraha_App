
import bcrypt from "bcrypt"
import { ROUNDS } from "../../../../config/config.service.js"
export const bcryptPssword = ({textPlan , rounds=ROUNDS}={})=>{
    return bcrypt.hashSync(textPlan , Number(rounds))
}


export const comparePssword = ({textPlan , cipertext}={})=>{
    return bcrypt.compareSync(textPlan , cipertext)
}






