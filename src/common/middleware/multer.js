import multer from "multer"
import fs from "node:fs"

export const multer_local = ({custom_Path ="General" , custom_typs = []}={})=>
{

  const full_path = `uploads/${custom_Path}`
  if(!fs.existsSync(full_path))
  {
    fs.mkdirSync(full_path , {recursive:true})
  }

    const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file , "--------");
    cb(null, full_path)
  },

  filename: function (req, file, cb) {
    const uniqueName = Math.random().toString(36).substring(2, 10);
    cb(null, uniqueName + "_" +  file.originalname )
  }
})

function fileFilter (req, file, cb) {

if(!custom_typs.includes(file.mimetype))
{
  cb(new Error('I don\'t have a clue!'))
}
  cb(null , true)

}

const upload = multer({ storage ,fileFilter })
return upload

}


export const  multer_host = ({ custom_typs = []}={})=>
{
 const storage = multer.diskStorage({})

function fileFilter (req, file, cb) {

if(!custom_typs.includes(file.mimetype))
{
  cb(new Error('I don\'t have a clue!'))
}
  cb(null , true)

}

const upload = multer({ storage ,fileFilter })
return upload

}





