import jwt from "jsonwebtoken"


export const generateToken = ({paylod, seucrit="secrit&^$" , options={}}={})=>{
    return jwt.sign(paylod , seucrit , options)
}

export const verifyToken = ({token, seucrit="secrit&^$" , options={}}={})=>{
    return jwt.verify(token , seucrit , options)
}


