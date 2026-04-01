import { emailEnum } from "../../common/enum/email.enum.js"
import { redisClient } from "./redis.db.js"

export const revoke_key = ({userId , jti}={})=>
{
    return `redis_token::${userId}::${jti}`
}

export const get_keys = ({userId}={})=>
{
    return `redis_token::${userId}`
}

export const otp_key = ({email , subject = emailEnum.confirmeEmail}={})=>
{
    return `otp::${email}::${subject}`
}

export const max_otp_key = ({email }={})=>
{
    return `${otp_key({email})}::max`
}

export const block_otp_key = ({email }={})=>
{
    return `${otp_key({email})}::block`
}


export const set = async({key , value , ttl}={})=>
{
    try {
        const data = typeof value === "string" ? value :JSON.stringify(value)
        return ttl ? await redisClient.set(key , data , {EX:ttl}): await redisClient.set(key , data)


    } catch (error) {
        console.log("error to set data in redis" , error);
        
    }
}

export const update = async({key , value , ttl}={})=>
{
    try {
        if(!await redisClient.exists(key))return 0
        return await set({key , value , ttl})
    } catch (error) {
        console.log("error to update data in redis" , error);
        
    }
}

export const get = async({key}={})=>
{
    try {
        try {
            return JSON.parse(await redisClient.get(key))
        } catch (error) {
            return await redisClient.get(key)
        }

    } catch (error) {
        console.log("error to get data in redis" , error);
        
    }
}

export const exists = async ({key}={})=>
{
    try {
        return await redisClient.exists(key)
    } catch (error) {
        console.log("error to exists data in redis" , error);
    }
}

export const ttl = async ({key}={})=>
{
    try {
        return await redisClient.ttl(key)
    } catch (error) {
        console.log("error to get ttl data in redis" , error);
    }
}

export const deleteKey = async ({key}={})=>
{
    try {

        if(!key.length) return 0
        return await redisClient.del(key)
    } catch (error) {
        console.log("error to delete data in redis" , error);
    }
}

export const expire = async ({key , ttl}={})=>
{
    try {
        return await redisClient.expire(key , ttl)
        
    } catch (error) {
        console.log("error to expire data in redis" , error);
    }
}

export const keys = async ({pattern}={})=>
{
    try {
        return await redisClient.keys(`${pattern}*`)
    } catch (error) {
        console.log("error to get keys from redis" , error);
    }
}

export const incr = async ({key}={})=>
{
    try {
        return await redisClient.incr(key)
    } catch (error) {
        console.log("error to incr keys from redis" , error);
    }
}