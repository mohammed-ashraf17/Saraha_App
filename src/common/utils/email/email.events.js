import { EventEmitter } from "node:events";
import { emailEnum } from "../../enum/email.enum.js";

export const eventEmitter = new EventEmitter()

eventEmitter.on(emailEnum.confirmeEmail , async(fn)=>{
    await fn()
})
