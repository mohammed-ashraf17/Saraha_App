

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


export const findOneAndUpdate = async({model , check = {} , update={}}={})=>
{
    return await model.findOneAndUpdate(check , update)
}

export const deleteMany = async({model , check = {}}={})=>
{
    return await model.deleteMany(check)
}