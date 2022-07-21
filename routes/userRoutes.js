import  express  from "express";
import userController from "../controller/userController.js";
import upload from "../controller/fileUpload.js";
const userRoutes = express.Router();

function authen (req,res,next) {
    const {email} = req.query
    if(req.session.session_email == email || req.session.session_male){
        next()
    }else{
        return res.redirect('/login')
    }
    
    
}

function alreadyLoggedIn (req,res,next) {
    if(req.session.session_email){
        let email = req.session.session_email
        return res.redirect(`/displayMsg?email=${email}&isGf=true`)
    }else{
        next()
    }    
}
userRoutes.post("/uploadImg",upload.single('images'),userController.uploadImage)
userRoutes.post('/register',upload.single('image'),userController.registerGf);
userRoutes.post('/login',userController.userLogin);
userRoutes.post('/displayMsg',userController.displayMsg);
userRoutes.post('/updateMsg',userController.updateMsg);
userRoutes.get('/', (req,res) => {res.render('homepage.ejs')})
userRoutes.get('/register',(req,res)=>{ res.render('register.ejs'), {title : 'Registration Page'}})
userRoutes.get('/login', alreadyLoggedIn,(req,res) => {res.render('login.ejs'), {title : 'Login Page'}})
userRoutes.get('/selectGf',userController.getSelectGf)
userRoutes.get('/displayMsg',authen,userController.getDisplayMsg)
userRoutes.get('/logout',userController.getLogOut)
userRoutes.get('/deleteMsg',userController.deleteMessage)
userRoutes.get('/displayProfile',userController.displayProfile)
userRoutes.get('/updateDesc',userController.getUpdateDesc)
export default userRoutes;