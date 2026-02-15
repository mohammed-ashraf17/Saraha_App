

export const find = async ({model , filteration ={}}={})=>
{
    const doc = model.find(filteration)
    return await doc.exec()
}
export const findOne =async ({model,check ={} , select = ""}={})=>{
    return await model.findOne(check).select(select)
     
}

export const create = async ({model , dataa ={}}={})=>
{
   return await model.create(dataa)
      
}