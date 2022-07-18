import  express  from "express";
import userController from "../controller/userController.js";
const userRoutes = express.Router();

function authen (req,res,next) {
    if(req.session.session_email || req.session.session_male){
        next()
    }else{
        return res.redirect('/login')
    }
    
    
}

userRoutes.post('/register',userController.registerGf);
userRoutes.post('/login',userController.userLogin);
userRoutes.post('/displayMsg',userController.displayMsg);
userRoutes.post('/updateGfMsg',userController.updateGfMsg);
userRoutes.post('/updateBfMsg',userController.updateBfMsg);
userRoutes.get('/', (req,res) => {res.render('homepage.ejs')})
userRoutes.get('/register',(req,res)=>{ res.render('register.ejs'), {title : 'Registration Page'}})
userRoutes.get('/login', (req,res) => {res.render('login.ejs'), {title : 'Login Page'}})
userRoutes.get('/selectGf',(req,res) => {res.render('selectGf.ejs', {title : 'Gf Selection'})})
userRoutes.get('/displayMsg',authen,userController.getDisplayMsg)
userRoutes.get('/logout',userController.getLogOut)
export default userRoutes;