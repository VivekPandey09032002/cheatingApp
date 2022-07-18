import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./db/connection.js";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import session from "express-session";
import * as dotenv from "dotenv" 
const app = express();

//env file setup
dotenv.config({
  path : './.env'
})
const port = process.env.PORT || 5000
const DbName = process.env.DB_NAME 
const DbUrI = process.env.DB_URI

//static resourse
app.use(express.static('public'))
//ejs-layout
app.use(expressEjsLayouts)
//setup body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
//cookie and session
app.use(cookieParser())
app.use(session({
  secret : 'Shh, its a secret!',
  resave : false,
  saveUninitialized : false
}))

//setting view engine to ejs
app.set("view engine", "ejs");
app.set('views','./views')
app.set('layout','./layout/main')


//connect to db
connectDB(DbName, DbUrI);


//router setup
app.use('/',userRoutes);


//listen
app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});