
import express from "express"
import checkConnectionDB from "./DB/connectionDB.js"
import userRouter from "./modules/user/user.controller.js"
import successResponse from "./common/utils/successes_response/succsses.response.js"
import cors from "cors"
import { PORT } from "../config/config.service.js"
const app = express()
const port = PORT


const bootstrap = ()=>{
    app.use( cors(),express.json())
    checkConnectionDB()
    app.use("/uploads" , express.static("uploads"))

app.get("/" , (req , res , next)=>
{
    successResponse({res , status:200 , message:`welcome on my app ....❤️`})
})

app.use("/users" , userRouter)


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