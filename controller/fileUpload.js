import multer from "multer";
import path from "path";

const diskStorage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null,path.join(path.dirname('upload'),'/upload/images'))
    },
    filename : (req,file,cb) =>{
        let firstName = req.body.email  || req.query.email
        cb(null,firstName+ "." + file.originalname.split('.')[1])
    }
})

const upload = new multer({storage : diskStorage})
export default upload;