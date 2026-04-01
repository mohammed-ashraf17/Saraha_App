
import express from "express"
import checkConnectionDB from "./DB/connectionDB.js"
import userRouter from "./modules/user/user.controller.js"
import successResponse from "./common/utils/successes_response/succsses.response.js"
import cors from "cors"
import { PORT, WHITLIST } from "../config/config.service.js"
import { redisConnecition } from "./DB/redis/redis.db.js"
import messageRouter from "./modules/message/message.controller.js"
import helmet from "helmet"
import {rateLimit} from "express-rate-limit"

const app = express()
const port = PORT


const bootstrap = async ()=>{
    
    const limiter = rateLimit(
        {
            windowMs:60 * 30 * 100,
            limit:3,
            message:"You have exceeded the allowed number of requests. Please try again after a while.",
            requestPropertyName: "rate_limit",
            handler:(req , res ,next)=>
            {
                return successResponse({res , status:409 , message:"Requests limit reached. Try again later."})
            },
            skipFailedRequests:true,
            legacyHeaders:false
        }
    )
    

    const corsOptions = {
    origin: function (origin, callback) {
            if([...WHITLIST , undefined].includes(origin))
            {
                callback(null , true)
            }
            else
            {
                callback(new Error("not allow by cors"))
            }
    }
}

    app.use(
    cors(corsOptions),
    helmet(),
    limiter,
    express.json())

    checkConnectionDB() 
    redisConnecition()

    // await set({key:"test" , value:"test" , ttl:60})
    // await redisClient.set("name" , "mohammed")
    // await redisClient.expire("name" , 60)

    app.use("/uploads" , express.static("uploads"))

app.get("/" , (req , res , next)=>
{
    console.log(req.rate_limit);
    
    successResponse({res , status:200 , message:`welcome on my app ....❤️`})
})

app.use("/users" , userRouter)
app.use("/messages" , messageRouter)


app.use('{/*demo}' , (req , res , next)=>
{

    throw new Error(`Url${req.originalUrl} NOT FOUND` , {cause:404});
})
app.use((err , req , res , next)=>{
    res.status(err.cause || 500).json({message : err.message , stack : err.stack})
})
app.listen(port , ()=>
{
    console.log(`the server is runnig on port ${port}....❤️ 📌`)

})
}

export default bootstrap