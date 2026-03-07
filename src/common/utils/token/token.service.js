import jwt from "jsonwebtoken"


export const generateToken = ({paylod, seucrit , options={}}={})=>{
    return jwt.sign(paylod , seucrit , options)
}

export const verifyToken = ({token, seucrit , options={}}={})=>{
    return jwt.verify(token , seucrit , options)
}


