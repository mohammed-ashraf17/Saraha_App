import dotenv from "dotenv"
import path from "node:path"

const env = process.env

const NODE_ENV = env.NODE_ENV

let envPaths = {
    development:".env.development",
    production:".env.production"   
}
dotenv.config({path:path.resolve(`config/${envPaths[NODE_ENV]}`)})

export const PORT = +env.PORT
export const DB_URI = env.DB_URI
export const DB_URI_LOCAL = env.DB_URI_LOCAL
export const ROUNDS = +env.ROUNDS
export const CLOUD_NAME = env.CLOUD_NAME
export const API_KEY = +env.API_KEY
export const API_SECRET = env.API_SECRET
export const ACCESS_SEUCRIT_KEY = env.ACCESS_SEUCRIT_KEY
export const REFRESH_SEUCRIT_KEY = env.REFRESH_SEUCRIT_KEY
export const PERFIX = env.PERFIX
export const REDIS_URL = env.REDIS_URL
export const EMAIL = env.EMAIL
export const PASSWORD = env.PASSWORD
export const WHITLIST = env.WHITLIST?.split(",") || []










