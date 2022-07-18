import  express  from "express";
import userController from "../controller/userController.js";
const userRoutes = express.Router();

function authen (req,res,next) {
    if(req.session.session_email){
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
userRoutes.get('/', (req,res) => {res.render('home.ejs')})
userRoutes.get('/register',(req,res)=>{ res.render('register.ejs'), {title : 'login Page'}})
userRoutes.get('/login', (req,res) => {res.render('login.ejs'), {title : 'Registration Page'}})
userRoutes.get('/selectGf',(req,res) => {res.render('selectGf.ejs', {title : 'Gf Selection'})})
userRoutes.get('/displayMsg',authen,userController.getDisplayMsg)
export default userRoutes;