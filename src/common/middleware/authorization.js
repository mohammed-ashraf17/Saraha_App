

export const authorization = ({roles = []}={})=>{
    return async (req , res , next)=>{
        if(!roles.includes(req.user.roles))
        {
            throw new Error("UnAuthorization" ,{cause:403});
        }
    next()
}
 
}
