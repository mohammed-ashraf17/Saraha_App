
import bcrypt from "bcrypt"
export const bcryptPssword = ({textPlan , rounds=12}={})=>{
    return bcrypt.hashSync(textPlan , rounds)
}


export const comparePssword = ({textPlan , cipertext}={})=>{
    return bcrypt.compareSync(textPlan , cipertext)
}






