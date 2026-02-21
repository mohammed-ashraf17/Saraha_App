import mongoose from "mongoose";
import { genderEnum, providerEnum, rolesEnum } from "../../common/enum/user.enum.js";


const userSchema = new mongoose.Schema(
    {
         firstName:
        {
            type:String,
            required:true,
            trim:true,
            minLength:3,
            maxLength:20
            
        },
           lastName:
        {
            type:String,
            required:true,
            trim:true,
            minLength:3,
            maxLength:20
        },
        email:
        {
            type:String,
            required:true,
            unique:true,
            trim:true,
          
        },
        password:
        {
            type:String,
            required:function()
            {
                return this.provider == providerEnum.google ? false : true
            },
            trim:true,
            minLength:7,
           
        },
        gender:{
            type:String,
            enum:Object.values(genderEnum),
            default:genderEnum.male
        },
        provider:{
            type:String,
            enum:Object.values(providerEnum),
            default:providerEnum.system
           
        },
           roles:{
            type:String,
            enum:Object.values(rolesEnum),
            default:rolesEnum.user
           
        },
        phone:
        {
            type:String,
            required:function()
            {
                return this.provider == providerEnum.google ? false : true
            },
            min:11,
            max:12,

        },
        age:Number,
        profilePicture:String,
        confirmed:Boolean,

    },
    {
        timestamps:true,
        strictQuery:true,
        toJSON:{virtuals:true},
        
    }
)

userSchema.virtual("userName")
.get(function()
{
    return this.firstName + " " + this.lastName
})
.set(function (v)
{
  this.firstName = v.split(" ")[0]
  this.lastName = v.split(" ")[1]
})


const userModel = mongoose.models.user || mongoose.model("user" , userSchema)
userModel.syncIndexes()
export default userModel