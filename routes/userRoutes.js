import  express  from "express";
import userController from "../controller/userController.js";
const userRoutes = express.Router();
userRoutes.post('/register',userController.registerGf);
userRoutes.post('/login',userController.userLogin);
userRoutes.post('/displayMsg',userController.displayMsg);
userRoutes.post('/updateGfMsg',userController.updateGfMsg);
userRoutes.post('/updateBfMsg',userController.updateBfMsg);
userRoutes.get('/register',(req,res)=>{ res.render('register.ejs')})
userRoutes.get('/login', (req,res) => {res.render('login.ejs')})
userRoutes.get('/selectGf',(req,res) => {res.render('selectGf.ejs')})
userRoutes.get('/displayMsg',(req,res) => {res.render('displayMsg.ejs')})
export default userRoutes;